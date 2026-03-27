import { callClaude } from '../claude-client'
import { parseJsonFromLLM } from '../utils'
import { PROMPTS } from './prompts'
import type { Problem, ValidatorOutput } from './types'

export async function runValidator(
  problems: Problem[],
  grade: number
): Promise<ValidatorOutput> {
  const userMessage = `Validate each math problem independently. Re-solve each problem from scratch (ignore solution_steps).

Grade level: ${grade === 0 ? 'Kindergarten' : `Grade ${grade}`}
Problems to validate (${problems.length} total):
${JSON.stringify(problems, null, 2)}

For each problem:
1. Re-calculate the correct answer independently from the question_text.
2. Check if correct_answer matches your calculation.
3. Check if the problem is appropriate for grade ${grade}.
4. Check if any choice matches your answer AND correct_index points to it.

Respond with ONLY this JSON (no markdown, no extra text):
{
  "approved": [ ...problem objects with validated=true ],
  "rejected": [
    {
      ...problem object,
      "validated": false,
      "rejection_reason": "specific explanation",
      "rejection_type": "wrong_answer | grade_mismatch | language_level | ambiguous | duplicate"
    }
  ]
}`

  const raw = await callClaude({
    systemPrompt: PROMPTS.validator,
    userMessage,
    maxTokens: 16000,
  })

  const result = parseJsonFromLLM<ValidatorOutput>(raw)

  return {
    approved: (result.approved ?? []).map((p) => ({ ...p, validated: true })),
    rejected: result.rejected ?? [],
  }
}
