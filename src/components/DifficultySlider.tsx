'use client'

import { useEffect } from 'react'

interface DifficultyMix {
  easy: number
  medium: number
  hard: number
}

interface Props {
  value: DifficultyMix
  count: number
  onChange: (mix: DifficultyMix) => void
}

export default function DifficultySlider({ value, count, onChange }: Props) {
  // Keep sum equal to count whenever count changes
  useEffect(() => {
    const total = value.easy + value.medium + value.hard
    if (total !== count) {
      const scale = count / (total || 1)
      const easy = Math.round(value.easy * scale)
      const medium = Math.round(value.medium * scale)
      const hard = Math.max(0, count - easy - medium)
      onChange({ easy, medium, hard })
    }
  }, [count]) // eslint-disable-line react-hooks/exhaustive-deps

  function set(key: keyof DifficultyMix, raw: number) {
    const v = Math.max(0, Math.min(count, raw))
    const remaining = count - v
    const otherKeys = (['easy', 'medium', 'hard'] as const).filter((k) => k !== key)
    const otherTotal = value[otherKeys[0]] + value[otherKeys[1]]

    let a: number, b: number
    if (otherTotal === 0) {
      a = Math.floor(remaining / 2)
      b = remaining - a
    } else {
      const ratio = value[otherKeys[0]] / otherTotal
      a = Math.round(remaining * ratio)
      b = remaining - a
    }

    onChange({ ...value, [key]: v, [otherKeys[0]]: a, [otherKeys[1]]: b })
  }

  const total = value.easy + value.medium + value.hard
  const easyPct = total > 0 ? (value.easy / total) * 100 : 33
  const mediumPct = total > 0 ? (value.medium / total) * 100 : 34
  const hardPct = total > 0 ? (value.hard / total) * 100 : 33

  return (
    <div className="space-y-3">
      {/* Visual bar */}
      <div className="h-3 rounded-full overflow-hidden flex">
        <div
          className="bg-green-400 transition-all"
          style={{ width: `${easyPct}%` }}
        />
        <div
          className="bg-yellow-400 transition-all"
          style={{ width: `${mediumPct}%` }}
        />
        <div
          className="bg-red-400 transition-all"
          style={{ width: `${hardPct}%` }}
        />
      </div>

      {/* Number inputs */}
      <div className="grid grid-cols-3 gap-3">
        {(
          [
            { key: 'easy', label: 'Easy', color: 'text-green-600', ring: 'focus:ring-green-400' },
            { key: 'medium', label: 'Medium', color: 'text-yellow-600', ring: 'focus:ring-yellow-400' },
            { key: 'hard', label: 'Hard', color: 'text-red-600', ring: 'focus:ring-red-400' },
          ] as const
        ).map(({ key, label, color, ring }) => (
          <div key={key} className="flex flex-col items-center gap-1">
            <span className={`text-xs font-semibold ${color}`}>{label}</span>
            <input
              type="number"
              min={0}
              max={count}
              value={value[key]}
              onChange={(e) => set(key, parseInt(e.target.value) || 0)}
              className={`w-full text-center border border-gray-300 rounded-lg px-2 py-1.5 text-sm
                          focus:outline-none focus:ring-2 ${ring}`}
            />
          </div>
        ))}
      </div>

      {total !== count && (
        <p className="text-xs text-red-500">Total ({total}) must equal problem count ({count})</p>
      )}
    </div>
  )
}
