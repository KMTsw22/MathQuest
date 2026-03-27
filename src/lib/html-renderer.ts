import type { Problem, ProblemsJson } from './agents/types'

const CHOICE_LABELS = ['A', 'B', 'C', 'D', 'E'] as const

function choiceValue(p: Problem, idx: number): string {
  const map: Record<number, string> = {
    0: p.choice_a,
    1: p.choice_b,
    2: p.choice_c,
    3: p.choice_d,
    4: p.choice_e,
  }
  return map[idx] ?? ''
}

function sectionHeader(label: string): string {
  const colors: Record<string, string> = {
    Easy: '#22c55e',
    Medium: '#f59e0b',
    Hard: '#ef4444',
  }
  const color = colors[label] ?? '#6b7280'
  return `
    <div style="background:${color};color:#fff;padding:8px 14px;border-radius:6px;
                font-size:14px;font-weight:700;margin:28px 0 16px;letter-spacing:.04em">
      ${label.toUpperCase()} Problems
    </div>`
}

function renderProblemStudent(p: Problem, n: number): string {
  const choices = CHOICE_LABELS.map(
    (lbl, i) => `
      <div style="margin:4px 0 4px 12px;font-size:14px">
        <strong>${lbl}.</strong> ${choiceValue(p, i)}
      </div>`
  ).join('')

  return `
    <div style="margin-bottom:28px;page-break-inside:avoid">
      <div style="font-weight:700;font-size:15px;margin-bottom:6px">${n}.</div>
      <div style="font-size:14px;line-height:1.7;margin-bottom:10px">${p.question_text}</div>
      <div style="margin:10px 0">${p.visual_html}</div>
      <div style="margin:10px 0">${choices}</div>
      <div style="margin-top:8px;font-size:13px;color:#888">
        My answer: <span style="border-bottom:1px solid #333;display:inline-block;width:40px">&nbsp;</span>
      </div>
    </div>`
}

function renderProblemTeacher(p: Problem, n: number): string {
  const choices = CHOICE_LABELS.map((lbl, i) => {
    const isCorrect = i === p.correct_index
    return `
      <div style="margin:4px 0 4px 12px;font-size:14px;
                  ${isCorrect ? 'color:#16a34a;font-weight:700' : 'color:#555'}">
        ${isCorrect ? '✓' : '○'} ${lbl}. ${choiceValue(p, i)}
      </div>`
  }).join('')

  const steps = p.solution_steps
    .map((s, i) => `<li style="margin:3px 0;color:#444">${s}</li>`)
    .join('')

  return `
    <div style="margin-bottom:32px;page-break-inside:avoid">
      <div style="font-weight:700;font-size:15px;margin-bottom:6px">${n}.</div>
      <div style="font-size:14px;line-height:1.7;margin-bottom:10px">${p.question_text}</div>
      <div style="margin:10px 0">${p.visual_html}</div>
      <div style="margin:10px 0">${choices}</div>
      <div style="background:#f0fdf4;border-left:4px solid #16a34a;padding:10px 14px;
                  border-radius:0 6px 6px 0;margin-top:10px;font-size:13px">
        <div style="margin-bottom:6px">
          <strong>Standard:</strong> ${p.ccss_standard} &nbsp;|&nbsp;
          <strong>Method:</strong> ${p.solving_method} &nbsp;|&nbsp;
          <strong>Difficulty:</strong> ${p.difficulty}
        </div>
        <div style="margin-bottom:4px"><strong>Solution:</strong></div>
        <ol style="margin:0;padding-left:18px">${steps}</ol>
      </div>
    </div>`
}

const BASE_STYLES = `
  body{font-family:system-ui,sans-serif;max-width:720px;margin:40px auto;padding:20px 24px;color:#333}
  h1{text-align:center;font-size:20px;border-bottom:2px solid #4A90D9;padding-bottom:10px;margin-bottom:0}
  .meta{display:flex;justify-content:space-between;flex-wrap:wrap;gap:12px;
        margin:18px 0 28px;font-size:14px}
  .field{display:inline-block;border-bottom:1px solid #333;min-width:160px;padding-bottom:2px}
  .footer{text-align:center;margin-top:48px;color:#888;font-size:13px;
          border-top:1px solid #ddd;padding-top:16px}
  @media print{
    .no-print{display:none}
    body{margin:20px;padding:10px}
  }
`

export function renderStudentHtml(data: ProblemsJson): string {
  const { meta, problems } = data
  const gradeLabel = meta.grade === 0 ? 'Kindergarten' : `Grade ${meta.grade}`

  const sections: string[] = []
  const difficulties: Array<'easy' | 'medium' | 'hard'> = ['easy', 'medium', 'hard']
  const labels: Record<string, string> = { easy: 'Easy', medium: 'Medium', hard: 'Hard' }

  let counter = 1
  for (const diff of difficulties) {
    const group = problems.filter((p) => p.difficulty === diff)
    if (group.length === 0) continue
    sections.push(sectionHeader(labels[diff]))
    sections.push(...group.map((p) => renderProblemStudent(p, counter++)))
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>${gradeLabel} — ${meta.topic} Worksheet</title>
  <style>${BASE_STYLES}</style>
</head>
<body>
  <h1>${gradeLabel} Math Worksheet — ${meta.topic}</h1>
  <div class="meta">
    <span>Name: <span class="field">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></span>
    <span>Date: <span class="field">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></span>
    <span>Score: ___ / ${problems.length}</span>
  </div>
  ${sections.join('\n')}
  <div class="footer">Keep up the great work! Show your work and explain your thinking.</div>
</body>
</html>`
}

export function renderTeacherHtml(data: ProblemsJson): string {
  const { meta, problems } = data
  const gradeLabel = meta.grade === 0 ? 'Kindergarten' : `Grade ${meta.grade}`
  const dist = meta.difficulty_distribution

  const sections: string[] = []
  const difficulties: Array<'easy' | 'medium' | 'hard'> = ['easy', 'medium', 'hard']
  const labels: Record<string, string> = { easy: 'Easy', medium: 'Medium', hard: 'Hard' }

  let counter = 1
  for (const diff of difficulties) {
    const group = problems.filter((p) => p.difficulty === diff)
    if (group.length === 0) continue
    sections.push(sectionHeader(labels[diff]))
    sections.push(...group.map((p) => renderProblemTeacher(p, counter++)))
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <title>ANSWER KEY — ${gradeLabel} ${meta.topic}</title>
  <style>${BASE_STYLES}</style>
</head>
<body>
  <h1>ANSWER KEY — ${gradeLabel} Math: ${meta.topic}</h1>
  <div class="meta">
    <span>Generated: ${meta.generated_at}</span>
    <span>Total: ${problems.length} problems</span>
    <span>Easy ${dist.easy} / Medium ${dist.medium} / Hard ${dist.hard}</span>
  </div>
  ${sections.join('\n')}
  <div class="footer">
    Teacher Notes:<br>
    <div style="border-bottom:1px solid #ddd;margin-top:8px;height:40px"></div>
  </div>
</body>
</html>`
}
