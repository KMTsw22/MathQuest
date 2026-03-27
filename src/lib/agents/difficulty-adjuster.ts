import { callClaude } from '../claude-client'
import { parseJsonFromLLM } from '../utils'
import { PROMPTS } from './prompts'
import type { Problem, DifficultyMix } from './types'

export async function runDifficultyAdjuster(
  problems: Problem[],
  targetMix: DifficultyMix
): Promise<Problem[]> {
  const currentMix = problems.reduce(
    (acc, p) => ({ ...acc, [p.difficulty]: acc[p.difficulty] + 1 }),
    { easy: 0, medium: 0, hard: 0 } as DifficultyMix
  )

  const needsAdjustment =
    currentMix.easy !== targetMix.easy ||
    currentMix.medium !== targetMix.medium ||
    currentMix.hard !== targetMix.hard

  // Skip Claude call if distribution already matches
  if (!needsAdjustment) return problems

  const userMessage = `Adjust the difficulty distribution of the following problems to match the target.

Current distribution: ${JSON.stringify(currentMix)}
Target distribution:  ${JSON.stringify(targetMix)}

Problems (${problems.length} total):
${JSON.stringify(problems, null, 2)}

Instructions:
- Change the minimum number of problems to reach the target distribution.
- When changing difficulty, update: difficulty, question_text (numbers/complexity), answer, solution_steps, visual_html, adjustment_note.
- Do NOT change: problem_id, number, grade, topic, ccss_standard, type, solving_method.
- adjustment_note must describe what was changed (e.g. "Easy→Medium: expanded to two-step calculation").

Respond with ONLY the updated JSON array (same length, no markdown, no extra text).`

  const raw = await callClaude({
    systemPrompt: PROMPTS.difficultyAdjuster,
    userMessage,
    maxTokens: 16000,
  })

  return parseJsonFromLLM<Problem[]>(raw)
}
