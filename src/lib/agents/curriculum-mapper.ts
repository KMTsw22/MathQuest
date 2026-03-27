import { callClaude } from '../claude-client'
import { parseJsonFromLLM, gradeToNumber } from '../utils'
import { PROMPTS } from './prompts'
import type { CurriculumMapperOutput, Grade } from './types'

export async function runCurriculumMapper(
  grade: Grade,
  topic: string
): Promise<CurriculumMapperOutput> {
  const gradeNum = gradeToNumber(grade)

  const userMessage = `Map the following request to Common Core State Standards and generate subtopics.

Input:
${JSON.stringify({ grade: gradeNum, grade_label: grade, topic }, null, 2)}

Respond with a single JSON object (no markdown fences, no extra text):
{
  "ccss_standards": ["string"],
  "subtopics": ["string (2-5 specific subtopics for problem variety)"],
  "grade_appropriate": boolean,
  "notes": "string or null"
}`

  const raw = await callClaude({
    systemPrompt: PROMPTS.curriculumMapper,
    userMessage,
    maxTokens: 1024,
  })

  return parseJsonFromLLM<CurriculumMapperOutput>(raw)
}
