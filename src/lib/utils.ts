import type { DifficultyMix } from './agents/types'

/**
 * Extracts and parses JSON from Claude responses.
 * Handles ```json ... ``` fences and partial JSON extraction.
 */
export function parseJsonFromLLM<T>(text: string): T {
  // Direct parse
  try {
    return JSON.parse(text) as T
  } catch {}

  // Strip ```json ... ``` or ``` ... ``` fences
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (fenced) {
    try {
      return JSON.parse(fenced[1].trim()) as T
    } catch {}
  }

  // Find first { or [ and last matching } or ]
  const start = text.search(/[{[]/)
  const lastBrace = text.lastIndexOf('}')
  const lastBracket = text.lastIndexOf(']')
  const end = Math.max(lastBrace, lastBracket)

  if (start !== -1 && end > start) {
    try {
      return JSON.parse(text.slice(start, end + 1)) as T
    } catch {}
  }

  throw new Error(
    `Cannot extract JSON from LLM response. First 300 chars:\n${text.slice(0, 300)}`
  )
}

export function gradeToNumber(grade: string | number): number {
  if (grade === 'K') return 0
  return Number(grade)
}

export function gradeToLabel(grade: string | number): string {
  if (grade === 'K' || grade === 0) return 'Kindergarten'
  return `Grade ${grade}`
}

/**
 * Rescales difficulty_mix so it always sums to count.
 */
export function normalizeDifficultyMix(
  mix: DifficultyMix,
  count: number
): DifficultyMix {
  const total = mix.easy + mix.medium + mix.hard
  if (total === count) return mix

  const scale = count / total
  const easy = Math.round(mix.easy * scale)
  const medium = Math.round(mix.medium * scale)
  const hard = count - easy - medium   // remainder goes to hard
  return { easy, medium, hard: Math.max(0, hard) }
}

export function today(): string {
  return new Date().toISOString().split('T')[0]
}
