import { callClaude } from '../claude-client'
import { parseJsonFromLLM, gradeToNumber } from '../utils'
import { PROMPTS } from './prompts'
import type { Problem, Grade, DifficultyMix } from './types'

interface ProblemGeneratorInput {
  grade: Grade
  topic: string
  subtopics: string[]
  ccss_standards: string[]
  count: number
  difficulty_mix: DifficultyMix
  start_id?: number
}

function buildVisualDataInstructions(gradeNum: number): string {
  if (gradeNum <= 3) {
    return `
visual_data RULES for Grade ${gradeNum} — use "counting_objects" type:
{
  "type": "counting_objects",
  "group_a": { "count": 2, "emoji": "🍎", "label": "apples" },
  "group_b": { "count": 3, "emoji": "🍊", "label": "oranges" },
  "operation": "add"   // or "subtract" or "count"
}
Use different emoji for each group. Available emoji: 🍎🍊🍋🍇🍓🫐🍒🥕🌟🦋🐸🐥⚽🎈🍪
For subtraction, omit group_b and set operation:"subtract" with group_a having the starting count.`
  }

  return `
visual_data RULES — choose the best type for each problem:

For multiplication/area problems:
{ "type": "area_model", "factor_a": 25, "factor_b": 14 }

For fraction position/addition problems:
{ "type": "number_line", "start": 0, "end": 1, "step_denominator": 4, "highlight": 0.75 }

For fraction comparison:
{ "type": "fraction_bar", "fractions": ["1/2", "2/4"], "compare": true }

For word problems with parts:
{ "type": "tape_diagram", "total": 12, "parts": [{"label":"given","value":4,"color":"#ef4444"},{"label":"kept","value":8,"color":"#3b82f6"}] }

For place value (grade 1-5):
{ "type": "place_value", "number": 3456 }

For geometry (rectangle/triangle/circle):
{ "type": "geometry_shape", "shape": "rectangle", "dimensions": {"width":6,"height":4}, "find":"area" }

For right triangle / pythagorean theorem:
{ "type": "right_triangle", "leg_a": 3, "leg_b": 4, "find": "hypotenuse" }

For algebra/equations:
{ "type": "equation_display", "equation": "2x + 3 = 11", "find": "x" }

For linear functions (grade 8):
{ "type": "coordinate_plane", "line": {"slope":2,"y_intercept":1}, "x_range":[-3,3], "y_range":[-3,7] }`
}

export async function runProblemGenerator(
  input: ProblemGeneratorInput
): Promise<Problem[]> {
  const gradeNum = gradeToNumber(input.grade)
  const startId = input.start_id ?? 1
  const visualInstructions = buildVisualDataInstructions(gradeNum)

  const userMessage = `Generate ${input.count} math problems for the following specification.

Specification:
${JSON.stringify({ grade: gradeNum, topic: input.topic, subtopics: input.subtopics, ccss_standards: input.ccss_standards, count: input.count, difficulty_mix: input.difficulty_mix }, null, 2)}

${visualInstructions}

REQUIREMENTS:
1. Return a JSON array of exactly ${input.count} problem objects.
2. Leave "visual_html" as empty string "" — it will be rendered server-side from visual_data.
3. All 5 choices must be distinct. Place the correct answer at a RANDOM position.
4. correct_index is 0-based (A=0, B=1, C=2, D=3, E=4).
5. correct_answer must EXACTLY match the choice at correct_index.
6. solution_steps: American "Show Your Work" / RDW style.
7. problem_id: "prob_${String(startId).padStart(3,'0')}" … "prob_${String(startId+input.count-1).padStart(3,'0')}".

Problem schema:
{
  "problem_id": "prob_001",
  "number": 1,
  "grade": ${gradeNum},
  "topic": "${input.topic}",
  "subtopic": "...",
  "difficulty": "easy | medium | hard",
  "type": "word_problem | equation | multiple_choice | true_false | visual",
  "solving_method": "area_model | number_line | tape_diagram | rdw | fraction_bar | place_value_chart | standard",
  "ccss_standard": "e.g. 3.NF.A.1",
  "question_text": "Problem statement in English",
  "visual_data": { ...choose the right type from the rules above... },
  "visual_html": "",
  "choice_a": "...", "choice_b": "...", "choice_c": "...", "choice_d": "...", "choice_e": "...",
  "correct_index": 1,
  "correct_answer": "...",
  "solution_steps": ["Step 1: ...", "Step 2: ..."],
  "adjustment_note": null
}

Respond with ONLY the JSON array. No markdown fences. No extra text.`

  const raw = await callClaude({
    systemPrompt: PROMPTS.problemGenerator,
    userMessage,
    maxTokens: 16000,
  })

  const problems = parseJsonFromLLM<Problem[]>(raw)

  return problems.map((p, i) => ({
    ...p,
    number: startId + i,
    grade: gradeNum,
    visual_html: '',   // populated later by formatter
    validated: false,
  }))
}
