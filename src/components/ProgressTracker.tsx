'use client'

export interface AgentLog {
  agent: string
  step: number
  label: string
  status: 'waiting' | 'running' | 'done'
  retries?: number
  warnings?: string[]
}

interface Props {
  logs: AgentLog[]
  errorMessage?: string
}

const STEP_DEFS = [
  { step: 1, agent: 'curriculum-mapper', label: 'Mapping curriculum standards' },
  { step: 2, agent: 'problem-generator', label: 'Generating problems' },
  { step: 3, agent: 'difficulty-adjuster', label: 'Adjusting difficulty' },
  { step: 4, agent: 'validator', label: 'Validating problems' },
  { step: 5, agent: 'formatter', label: 'Generating output files' },
]

export default function ProgressTracker({ logs, errorMessage }: Props) {
  const getStatus = (step: number) => {
    const log = logs.find((l) => l.step === step)
    return log?.status ?? 'waiting'
  }
  const getLog = (step: number) => logs.find((l) => l.step === step)

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mt-4">
      <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
        Pipeline Progress
      </h2>

      <div className="space-y-3">
        {STEP_DEFS.map((def, i) => {
          const status = getStatus(def.step)
          const log = getLog(def.step)
          const isLast = i === STEP_DEFS.length - 1

          return (
            <div key={def.step} className="flex gap-3">
              {/* Connector line + icon */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold
                    ${status === 'done' ? 'bg-green-100 text-green-700' : ''}
                    ${status === 'running' ? 'bg-blue-100 text-blue-700' : ''}
                    ${status === 'waiting' ? 'bg-gray-100 text-gray-400' : ''}
                  `}
                >
                  {status === 'done' ? '✓' : status === 'running' ? (
                    <span className="animate-spin inline-block">⟳</span>
                  ) : def.step}
                </div>
                {!isLast && (
                  <div className={`w-0.5 flex-1 mt-1 ${status === 'done' ? 'bg-green-200' : 'bg-gray-100'}`} />
                )}
              </div>

              {/* Content */}
              <div className="pb-4 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-medium
                    ${status === 'done' ? 'text-gray-800' : ''}
                    ${status === 'running' ? 'text-blue-700' : ''}
                    ${status === 'waiting' ? 'text-gray-400' : ''}
                  `}>
                    {log?.label ?? def.label}
                  </span>
                  {status === 'running' && (
                    <span className="text-xs text-blue-500 animate-pulse">Working…</span>
                  )}
                  {status === 'done' && (
                    <span className="text-xs text-green-600">Done</span>
                  )}
                </div>

                {/* Retry badge */}
                {(log?.retries ?? 0) > 0 && (
                  <div className="mt-1 text-xs text-yellow-600 bg-yellow-50 border border-yellow-200
                                  rounded px-2 py-0.5 inline-block">
                    ↻ Retried {log?.retries} time{log?.retries !== 1 ? 's' : ''}
                  </div>
                )}

                {/* Warnings */}
                {log?.warnings?.map((w, wi) => (
                  <div key={wi} className="mt-1 text-xs text-orange-600 bg-orange-50 border border-orange-200
                                           rounded px-2 py-0.5">
                    ⚠ {w}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {errorMessage && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          <strong>Error:</strong> {errorMessage}
        </div>
      )}
    </div>
  )
}
