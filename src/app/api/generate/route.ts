import { runCurriculumMapper } from '@/lib/agents/curriculum-mapper'
import { runProblemGenerator } from '@/lib/agents/problem-generator'
import { runDifficultyAdjuster } from '@/lib/agents/difficulty-adjuster'
import { runValidator } from '@/lib/agents/validator'
import { runFormatter } from '@/lib/agents/formatter'
import {
  saveSession,
  purgeOldSessions,
  generateSessionId,
} from '@/lib/session-store'
import { gradeToNumber, normalizeDifficultyMix } from '@/lib/utils'
import type { GenerateRequest, Problem, SSEEvent } from '@/lib/agents/types'

export const maxDuration = 300   // 5 min — adjust for your hosting plan

const MAX_RETRIES = 3
const encoder = new TextEncoder()

function sseChunk(event: SSEEvent): Uint8Array {
  return encoder.encode(`data: ${JSON.stringify(event)}\n\n`)
}

export async function POST(req: Request) {
  let body: GenerateRequest
  try {
    body = await req.json()
  } catch {
    return new Response('Invalid JSON', { status: 400 })
  }

  // Basic validation
  const gradeNum = gradeToNumber(body.grade)
  if (gradeNum < 0 || gradeNum > 8) {
    return new Response('Grade must be K–8', { status: 400 })
  }
  if (!body.topic?.trim()) {
    return new Response('Topic is required', { status: 400 })
  }
  const count = Math.min(50, Math.max(1, Number(body.count) || 10))
  const diffMix = normalizeDifficultyMix(body.difficulty_mix, count)

  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: SSEEvent) => controller.enqueue(sseChunk(event))

      purgeOldSessions()

      try {
        // ── Step 1: Curriculum Mapper ─────────────────────────────────────
        send({ type: 'agent_start', agent: 'curriculum-mapper', step: 1, label: 'Mapping curriculum standards' })
        const curriculum = await runCurriculumMapper(body.grade, body.topic)
        send({ type: 'agent_done', agent: 'curriculum-mapper', step: 1 })

        if (!curriculum.grade_appropriate) {
          send({
            type: 'warning',
            message: curriculum.notes ?? `Topic "${body.topic}" may not be standard for this grade level.`,
          })
        }

        // ── Steps 2–4: Generator → Adjuster → Validator loop ─────────────
        let approvedProblems: Problem[] = []
        let problemsNeeded = count
        let attempt = 0
        let problemIdOffset = 1

        while (attempt <= MAX_RETRIES && approvedProblems.length < count) {
          // Step 2: Problem Generator
          send({ type: 'agent_start', agent: 'problem-generator', step: 2, label: `Generating ${problemsNeeded} problems` })
          const drafts = await runProblemGenerator({
            grade: body.grade,
            topic: body.topic,
            subtopics: curriculum.subtopics,
            ccss_standards: curriculum.ccss_standards,
            count: problemsNeeded,
            difficulty_mix: normalizeDifficultyMix(diffMix, problemsNeeded),
            start_id: problemIdOffset,
          })
          send({ type: 'agent_done', agent: 'problem-generator', step: 2 })

          // Step 3: Difficulty Adjuster
          send({ type: 'agent_start', agent: 'difficulty-adjuster', step: 3, label: 'Adjusting difficulty distribution' })
          const adjusted = await runDifficultyAdjuster(
            drafts,
            normalizeDifficultyMix(diffMix, problemsNeeded)
          )
          send({ type: 'agent_done', agent: 'difficulty-adjuster', step: 3 })

          // Step 4: Validator
          send({ type: 'agent_start', agent: 'validator', step: 4, label: 'Validating problems' })
          const { approved, rejected } = await runValidator(adjusted, gradeNum)
          send({ type: 'agent_done', agent: 'validator', step: 4 })

          approvedProblems = [...approvedProblems, ...approved]
          problemIdOffset += drafts.length

          if (rejected.length === 0 || attempt >= MAX_RETRIES) break

          send({ type: 'retry', attempt: attempt + 1, rejected_count: rejected.length })
          problemsNeeded = Math.min(rejected.length, count - approvedProblems.length)
          attempt++
        }

        if (approvedProblems.length < count) {
          send({
            type: 'warning',
            message: `Only ${approvedProblems.length} of ${count} problems passed validation. Proceeding with available problems.`,
          })
        }

        if (approvedProblems.length === 0) {
          send({ type: 'error', message: 'No problems passed validation. Please try again.' })
          controller.close()
          return
        }

        // ── Step 5: Formatter ─────────────────────────────────────────────
        send({ type: 'agent_start', agent: 'formatter', step: 5, label: 'Generating output files' })
        const formatted = runFormatter(
          approvedProblems.slice(0, count),
          gradeNum,
          body.topic,
          diffMix
        )
        send({ type: 'agent_done', agent: 'formatter', step: 5 })

        // ── Store & complete ──────────────────────────────────────────────
        const sessionId = generateSessionId()
        saveSession(sessionId, {
          problems_json: formatted.problems_json,
          student_html: formatted.student_html,
          teacher_html: formatted.teacher_html,
        })

        send({
          type: 'complete',
          sessionId,
          total_approved: approvedProblems.length,
          total_requested: count,
        })
      } catch (err) {
        send({
          type: 'error',
          message: err instanceof Error ? err.message : String(err),
        })
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  })
}
