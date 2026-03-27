import { renderStudentHtml, renderTeacherHtml } from '../html-renderer'
import { renderVisual } from '../visual-renderer'
import { today } from '../utils'
import type { Problem, DifficultyMix, FormatterOutput, ProblemsJson } from './types'

/**
 * Pure formatter — no Claude call needed.
 * Sorts problems, builds problems.json, and renders HTML files server-side.
 */
export function runFormatter(
  problems: Problem[],
  grade: number,
  topic: string,
  difficultyMix: DifficultyMix
): FormatterOutput {
  const difficultyOrder: Record<string, number> = { easy: 0, medium: 1, hard: 2 }

  // Sort by difficulty, renumber, and render visual_html from visual_data
  const sorted = [...problems]
    .sort((a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty])
    .map((p, i) => ({
      ...p,
      number: i + 1,
      visual_html: p.visual_data ? renderVisual(p.visual_data) : p.visual_html ?? '',
    }))

  // Collect all unique CCSS standards
  const ccssSet = new Set(sorted.map((p) => p.ccss_standard).filter(Boolean))

  const actualMix: DifficultyMix = sorted.reduce(
    (acc, p) => ({ ...acc, [p.difficulty]: acc[p.difficulty] + 1 }),
    { easy: 0, medium: 0, hard: 0 }
  )

  const data: ProblemsJson = {
    meta: {
      grade,
      topic,
      generated_at: today(),
      total: sorted.length,
      difficulty_distribution: actualMix,
      ccss_standards: Array.from(ccssSet),
    },
    problems: sorted,
  }

  return {
    problems_json: JSON.stringify(data, null, 2),
    student_html: renderStudentHtml(data),
    teacher_html: renderTeacherHtml(data),
  }
}
