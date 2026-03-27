import fs from 'fs'
import path from 'path'

function loadAgentPrompt(agentDir: string): string {
  const base = path.join(process.cwd(), 'agents', agentDir)
  const instructions = fs.readFileSync(
    path.join(base, 'INSTRUCTIONS.md'),
    'utf-8'
  )
  const skillPath = path.join(base, 'skills', 'SKILL.md')
  const skill = fs.existsSync(skillPath)
    ? fs.readFileSync(skillPath, 'utf-8')
    : ''

  return skill
    ? `${instructions}\n\n---\n\n## Skills Reference\n\n${skill}`
    : instructions
}

// Loaded once per process. In serverless cold starts this runs fresh each time.
export const PROMPTS = {
  curriculumMapper: loadAgentPrompt('curriculum-mapper'),
  problemGenerator: loadAgentPrompt('problem-generator'),
  difficultyAdjuster: loadAgentPrompt('difficulty-adjuster'),
  validator: loadAgentPrompt('validator'),
} as const
