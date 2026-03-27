'use client'

import { useState } from 'react'
import DifficultySlider from './DifficultySlider'
import type { GenerateRequest, Grade } from '@/lib/agents/types'

const GRADES: { value: Grade; label: string }[] = [
  { value: 'K', label: 'Kindergarten' },
  { value: 1, label: 'Grade 1' },
  { value: 2, label: 'Grade 2' },
  { value: 3, label: 'Grade 3' },
  { value: 4, label: 'Grade 4' },
  { value: 5, label: 'Grade 5' },
  { value: 6, label: 'Grade 6' },
  { value: 7, label: 'Grade 7' },
  { value: 8, label: 'Grade 8' },
]

const TOPIC_SUGGESTIONS: Record<string, string[]> = {
  K: ['counting', 'addition to 10', 'subtraction to 10', 'shapes'],
  '1': ['addition to 20', 'subtraction to 20', 'place value', 'measurement'],
  '2': ['addition to 100', 'subtraction to 100', 'time', 'money'],
  '3': ['multiplication', 'division', 'fractions', 'area'],
  '4': ['multi-digit multiplication', 'fractions', 'decimals', 'angles'],
  '5': ['fraction operations', 'decimal operations', 'volume', 'coordinate plane'],
  '6': ['ratios', 'integers', 'expressions', 'statistics'],
  '7': ['proportional relationships', 'linear equations', 'geometry', 'probability'],
  '8': ['linear equations', 'functions', 'pythagorean theorem', 'transformations'],
}

interface Props {
  onSubmit: (req: GenerateRequest) => void
  disabled: boolean
}

export default function GenerateForm({ onSubmit, disabled }: Props) {
  const [grade, setGrade] = useState<Grade>(3)
  const [topic, setTopic] = useState('fractions')
  const [count, setCount] = useState(10)
  const [diffMix, setDiffMix] = useState({ easy: 3, medium: 5, hard: 2 })

  const suggestions = TOPIC_SUGGESTIONS[String(grade)] ?? []
  const mixValid = diffMix.easy + diffMix.medium + diffMix.hard === count

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!mixValid) return
    onSubmit({ grade, topic, count, difficulty_mix: diffMix })
  }

  function handleCountChange(n: number) {
    const clamped = Math.min(50, Math.max(1, n))
    setCount(clamped)
    // Rescale mix proportionally
    const total = diffMix.easy + diffMix.medium + diffMix.hard
    const scale = clamped / (total || 1)
    const easy = Math.round(diffMix.easy * scale)
    const medium = Math.round(diffMix.medium * scale)
    setDiffMix({ easy, medium, hard: Math.max(0, clamped - easy - medium) })
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-6">
      <h2 className="text-lg font-bold text-gray-800">Generate Math Problems</h2>

      {/* Grade + Topic */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Grade Level</label>
          <select
            value={grade}
            onChange={(e) => {
              const g = e.target.value === 'K' ? 'K' : (Number(e.target.value) as Grade)
              setGrade(g)
            }}
            disabled={disabled}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
                       focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-50"
          >
            {GRADES.map((g) => (
              <option key={String(g.value)} value={String(g.value)}>
                {g.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Topic</label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            disabled={disabled}
            placeholder="e.g. fractions, multiplication..."
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm
                       focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-50"
          />
          {suggestions.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1.5">
              {suggestions.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setTopic(s)}
                  disabled={disabled}
                  className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-600
                             hover:bg-blue-100 border border-blue-200 disabled:opacity-50"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Problem count */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Number of Problems
          <span className="ml-1 text-gray-400 font-normal">(1–50)</span>
        </label>
        <input
          type="number"
          min={1}
          max={50}
          value={count}
          onChange={(e) => handleCountChange(parseInt(e.target.value) || 1)}
          disabled={disabled}
          className="w-32 border border-gray-300 rounded-lg px-3 py-2 text-sm
                     focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-50"
        />
      </div>

      {/* Difficulty mix */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Difficulty Distribution
        </label>
        <DifficultySlider value={diffMix} count={count} onChange={setDiffMix} />
      </div>

      <button
        type="submit"
        disabled={disabled || !topic.trim() || !mixValid}
        className="w-full bg-blue-600 text-white font-semibold py-2.5 px-4 rounded-xl
                   hover:bg-blue-700 active:bg-blue-800 transition-colors
                   disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {disabled ? 'Generating...' : 'Generate Problems'}
      </button>
    </form>
  )
}
