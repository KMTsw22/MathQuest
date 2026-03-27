'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import type { ProblemsJson, Problem } from '@/lib/agents/types'

const CHOICE_KEYS = ['A', 'B', 'C', 'D', 'E'] as const

function choiceValue(p: Problem, idx: number): string {
  return [p.choice_a, p.choice_b, p.choice_c, p.choice_d, p.choice_e][idx] ?? ''
}

// ── Score Summary ─────────────────────────────────────────────────────────

function ScoreSummary({
  problems,
  answers,
  onRestart,
}: {
  problems: Problem[]
  answers: (number | null)[]
  onRestart: () => void
}) {
  const correct = answers.filter((a, i) => a === problems[i].correct_index).length
  const pct = Math.round((correct / problems.length) * 100)

  const grade =
    pct >= 90 ? { label: 'Excellent! 🌟', color: '#16a34a' } :
    pct >= 70 ? { label: 'Good Job! 👍', color: '#2563eb' } :
    pct >= 50 ? { label: 'Keep Practicing! 💪', color: '#d97706' } :
                { label: "Don't Give Up! 🌱", color: '#dc2626' }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl p-8 max-w-lg w-full text-center">
        <div className="text-6xl mb-4">
          {pct >= 90 ? '🏆' : pct >= 70 ? '🎉' : pct >= 50 ? '📚' : '🌱'}
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">All Done!</h2>
        <p className="text-lg font-semibold mb-1" style={{ color: grade.color }}>
          {grade.label}
        </p>
        <div className="text-5xl font-black my-6" style={{ color: grade.color }}>
          {correct} / {problems.length}
        </div>
        <div className="w-full bg-gray-100 rounded-full h-4 mb-6">
          <div
            className="h-4 rounded-full transition-all"
            style={{ width: `${pct}%`, background: grade.color }}
          />
        </div>

        {/* Per-problem summary */}
        <div className="space-y-2 mb-8 text-left max-h-60 overflow-y-auto">
          {problems.map((p, i) => {
            const isCorrect = answers[i] === p.correct_index
            return (
              <div
                key={p.problem_id}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm
                  ${isCorrect ? 'bg-green-50' : 'bg-red-50'}`}
              >
                <span className="text-lg">{isCorrect ? '✅' : '❌'}</span>
                <span className="flex-1 line-clamp-1 text-gray-700">{p.question_text}</span>
                {!isCorrect && (
                  <span className="text-xs text-green-700 font-semibold shrink-0">
                    Ans: {p.correct_answer}
                  </span>
                )}
              </div>
            )
          })}
        </div>

        <button
          onClick={onRestart}
          className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl
                     hover:bg-blue-700 active:bg-blue-800 transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  )
}

// ── Main Practice Page ────────────────────────────────────────────────────

export default function PracticePage() {
  const params = useParams<{ sessionId: string }>()
  const router = useRouter()
  const [data, setData] = useState<ProblemsJson | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>([])
  const [selected, setSelected] = useState<number | null>(null)
  const [showAnswer, setShowAnswer] = useState(false)
  const [showSummary, setShowSummary] = useState(false)
  const visualRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch(`/api/session/${params.sessionId}`)
      .then((r) => {
        if (!r.ok) throw new Error('Session expired or not found')
        return r.json()
      })
      .then((d: ProblemsJson) => {
        setData(d)
        setAnswers(new Array(d.problems.length).fill(null))
        setLoading(false)
      })
      .catch((e) => {
        setError(e.message)
        setLoading(false)
      })
  }, [params.sessionId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50">
        <div className="text-center">
          <div className="text-5xl animate-bounce mb-4">📐</div>
          <p className="text-gray-500">Loading problems…</p>
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-center">
          <div className="text-5xl mb-4">😕</div>
          <p className="text-red-600 font-semibold">{error ?? 'Unknown error'}</p>
          <button
            onClick={() => router.push('/generate')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            Go back
          </button>
        </div>
      </div>
    )
  }

  if (showSummary) {
    return (
      <ScoreSummary
        problems={data.problems}
        answers={answers}
        onRestart={() => {
          setIndex(0)
          setAnswers(new Array(data.problems.length).fill(null))
          setSelected(null)
          setShowAnswer(false)
          setShowSummary(false)
        }}
      />
    )
  }

  const problem = data.problems[index]
  const total = data.problems.length
  const correctCount = answers.filter((a, i) => a === data.problems[i].correct_index).length

  function handleSelect(choiceIdx: number) {
    if (showAnswer) return
    setSelected(choiceIdx)
    setShowAnswer(true)
    setAnswers((prev) => {
      const next = [...prev]
      next[index] = choiceIdx
      return next
    })
  }

  function handleNext() {
    if (index + 1 >= total) {
      setShowSummary(true)
    } else {
      setIndex(index + 1)
      setSelected(null)
      setShowAnswer(false)
    }
  }

  const isCorrect = selected === problem.correct_index

  const diffColor: Record<string, string> = {
    easy: 'bg-green-100 text-green-700',
    medium: 'bg-yellow-100 text-yellow-700',
    hard: 'bg-red-100 text-red-700',
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* ── Top bar ── */}
      <div className="sticky top-0 z-10 bg-white/90 backdrop-blur border-b border-gray-200 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none"
            title="Back"
          >
            ←
          </button>

          {/* Progress bar */}
          <div className="flex-1">
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>Problem {index + 1} of {total}</span>
              <span>✅ {correctCount} correct</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all"
                style={{ width: `${((index + 1) / total) * 100}%` }}
              />
            </div>
          </div>

          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${diffColor[problem.difficulty]}`}>
            {problem.difficulty}
          </span>
        </div>
      </div>

      {/* ── Problem card ── */}
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">

        {/* Question */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <p className="text-xs text-gray-400 mb-3 font-medium uppercase tracking-wide">
            {problem.ccss_standard} · {problem.solving_method.replace(/_/g, ' ')}
          </p>
          <p className="text-lg font-semibold text-gray-800 leading-relaxed">
            {problem.question_text}
          </p>
        </div>

        {/* Visual */}
        <div
          ref={visualRef}
          className="rounded-2xl overflow-hidden shadow-sm"
          dangerouslySetInnerHTML={{ __html: problem.visual_html }}
        />

        {/* Choices */}
        <div className="space-y-3">
          {CHOICE_KEYS.map((lbl, i) => {
            const val = choiceValue(problem, i)
            const isSelected = selected === i
            const isRight = i === problem.correct_index

            let style =
              'bg-white border-2 border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50'

            if (showAnswer) {
              if (isRight) style = 'bg-green-50 border-2 border-green-400 text-green-800'
              else if (isSelected && !isRight)
                style = 'bg-red-50 border-2 border-red-400 text-red-700'
              else style = 'bg-white border-2 border-gray-100 text-gray-400'
            } else if (isSelected) {
              style = 'bg-blue-50 border-2 border-blue-500 text-blue-800'
            }

            return (
              <button
                key={lbl}
                onClick={() => handleSelect(i)}
                disabled={showAnswer}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl
                            font-semibold text-left transition-all ${style}
                            disabled:cursor-default`}
              >
                <span
                  className={`w-8 h-8 rounded-full flex items-center justify-center
                               text-sm font-black shrink-0
                    ${showAnswer && isRight ? 'bg-green-400 text-white' : ''}
                    ${showAnswer && isSelected && !isRight ? 'bg-red-400 text-white' : ''}
                    ${!showAnswer ? 'bg-gray-100 text-gray-600' : 'bg-transparent text-inherit'}
                  `}
                >
                  {lbl}
                </span>
                <span className="text-base">{val}</span>
                {showAnswer && isRight && (
                  <span className="ml-auto text-green-600 text-xl">✓</span>
                )}
                {showAnswer && isSelected && !isRight && (
                  <span className="ml-auto text-red-500 text-xl">✗</span>
                )}
              </button>
            )
          })}
        </div>

        {/* Feedback + solution */}
        {showAnswer && (
          <div
            className={`rounded-2xl p-5 border-2 ${
              isCorrect
                ? 'bg-green-50 border-green-300'
                : 'bg-orange-50 border-orange-300'
            }`}
          >
            <p className={`text-lg font-bold mb-3 ${isCorrect ? 'text-green-700' : 'text-orange-700'}`}>
              {isCorrect ? '🎉 Correct!' : `❌ The answer is ${problem.correct_answer}`}
            </p>
            <div className="space-y-1">
              {problem.solution_steps.map((step, i) => (
                <p key={i} className="text-sm text-gray-600">
                  <span className="font-semibold text-gray-700">Step {i + 1}: </span>
                  {step.replace(/^Step \d+:?\s*/i, '')}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Next button */}
        {showAnswer && (
          <button
            onClick={handleNext}
            className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl
                       text-lg hover:bg-blue-700 active:bg-blue-800 transition-colors
                       shadow-md shadow-blue-200"
          >
            {index + 1 >= total ? 'See Results 🏆' : 'Next Problem →'}
          </button>
        )}
      </div>
    </div>
  )
}
