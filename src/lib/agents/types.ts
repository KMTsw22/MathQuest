export type Grade = 'K' | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8

export interface DifficultyMix {
  easy: number
  medium: number
  hard: number
}

export interface GenerateRequest {
  grade: Grade
  topic: string
  count: number
  difficulty_mix: DifficultyMix
}

export type Difficulty = 'easy' | 'medium' | 'hard'
export type ProblemType = 'word_problem' | 'equation' | 'multiple_choice' | 'true_false' | 'visual'
export type SolvingMethod =
  | 'area_model'
  | 'number_line'
  | 'tape_diagram'
  | 'rdw'
  | 'fraction_bar'
  | 'place_value_chart'
  | 'standard'

// ── Structured visual data (AI returns this, server renders SVG) ──────────

export type VisualData =
  | {
      type: 'counting_objects'
      group_a: { count: number; emoji: string; label: string }
      group_b?: { count: number; emoji: string; label: string }
      operation: 'count' | 'add' | 'subtract'
    }
  | {
      type: 'right_triangle'
      leg_a: number
      leg_b: number
      find: 'hypotenuse' | 'leg_a' | 'leg_b'
    }
  | {
      type: 'area_model'
      factor_a: number | string  // e.g. 25 or "2/3"
      factor_b: number | string
      unit?: string
    }
  | {
      type: 'number_line'
      start: number
      end: number
      step_denominator: number        // 4 means marks at 1/4, 2/4, 3/4
      highlight?: number              // e.g. 0.75
      jumps?: Array<{ from: number; to: number; label: string }>
    }
  | {
      type: 'fraction_bar'
      fractions: string[]            // e.g. ["1/2", "2/4"]
      compare?: boolean
    }
  | {
      type: 'tape_diagram'
      total: number
      parts: Array<{ label: string; value: number; color: string }>
    }
  | {
      type: 'place_value'
      number: number
    }
  | {
      type: 'geometry_shape'
      shape: 'rectangle' | 'triangle' | 'circle' | 'parallelogram'
      dimensions: Record<string, number>   // e.g. { width:6, height:4 }
      find: string                          // e.g. "area", "perimeter"
    }
  | {
      type: 'equation_display'
      equation: string       // e.g. "2x + 3 = 11"
      find: string           // e.g. "x"
    }
  | {
      type: 'coordinate_plane'
      points?: Array<{ x: number; y: number; label?: string }>
      line?: { slope: number; y_intercept: number }
      x_range: [number, number]
      y_range: [number, number]
    }

export interface Problem {
  problem_id: string
  number: number
  grade: number
  topic: string
  subtopic: string
  difficulty: Difficulty
  type: ProblemType
  solving_method: SolvingMethod
  ccss_standard: string
  question_text: string
  visual_data: VisualData          // AI returns this
  visual_html: string              // rendered server-side from visual_data
  choice_a: string
  choice_b: string
  choice_c: string
  choice_d: string
  choice_e: string
  correct_index: number            // 0=A, 1=B, 2=C, 3=D, 4=E
  correct_answer: string
  solution_steps: string[]
  adjustment_note: string | null
  validated?: boolean
}

export interface RejectedProblem extends Problem {
  rejection_reason: string
  rejection_type: 'wrong_answer' | 'grade_mismatch' | 'language_level' | 'ambiguous' | 'duplicate'
}

export interface CurriculumMapperOutput {
  ccss_standards: string[]
  subtopics: string[]
  grade_appropriate: boolean
  notes: string | null
}

export interface ValidatorOutput {
  approved: Problem[]
  rejected: RejectedProblem[]
}

export interface ProblemsJson {
  meta: {
    grade: number
    topic: string
    generated_at: string
    total: number
    difficulty_distribution: DifficultyMix
    ccss_standards: string[]
  }
  problems: Problem[]
}

export interface FormatterOutput {
  problems_json: string   // serialized ProblemsJson
  student_html: string
  teacher_html: string
}

// SSE event types streamed to the frontend
export type SSEEvent =
  | { type: 'agent_start'; agent: string; step: number; label: string }
  | { type: 'agent_done'; agent: string; step: number }
  | { type: 'retry'; attempt: number; rejected_count: number }
  | { type: 'warning'; message: string }
  | { type: 'complete'; sessionId: string; total_approved: number; total_requested: number }
  | { type: 'error'; message: string }
