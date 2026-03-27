'use client'

import { useReducer, useRef } from 'react'
import GenerateForm from '@/components/GenerateForm'
import ProgressTracker, { type AgentLog } from '@/components/ProgressTracker'
import ResultPreview from '@/components/ResultPreview'
import type { GenerateRequest, SSEEvent } from '@/lib/agents/types'

// ── State ──────────────────────────────────────────────────────────────────

type Status = 'idle' | 'running' | 'done' | 'error'

interface AppState {
  status: Status
  logs: AgentLog[]
  sessionId: string | null
  totalApproved: number
  totalRequested: number
  errorMessage: string | null
}

const initial: AppState = {
  status: 'idle',
  logs: [],
  sessionId: null,
  totalApproved: 0,
  totalRequested: 0,
  errorMessage: null,
}

type Action =
  | { type: 'START'; count: number }
  | { type: 'SSE'; event: SSEEvent }
  | { type: 'ERROR'; message: string }

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'START':
      return { ...initial, status: 'running', totalRequested: action.count }

    case 'SSE': {
      const ev = action.event

      if (ev.type === 'agent_start') {
        const existing = state.logs.find((l) => l.step === ev.step)
        const logs = existing
          ? state.logs.map((l) =>
              l.step === ev.step ? { ...l, status: 'running' as const, label: ev.label } : l
            )
          : [
              ...state.logs,
              {
                agent: ev.agent,
                step: ev.step,
                label: ev.label,
                status: 'running' as const,
                retries: 0,
                warnings: [],
              },
            ]
        return { ...state, logs }
      }

      if (ev.type === 'agent_done') {
        return {
          ...state,
          logs: state.logs.map((l) =>
            l.step === ev.step ? { ...l, status: 'done' as const } : l
          ),
        }
      }

      if (ev.type === 'retry') {
        // Increment retry count on problem-generator (step 2)
        return {
          ...state,
          logs: state.logs.map((l) =>
            l.step === 2 ? { ...l, retries: (l.retries ?? 0) + 1, status: 'waiting' as const } : l
          ),
        }
      }

      if (ev.type === 'warning') {
        // Add warning to the last running agent
        const lastRunning = [...state.logs].reverse().find((l) => l.status === 'running' || l.status === 'done')
        if (!lastRunning) return state
        return {
          ...state,
          logs: state.logs.map((l) =>
            l.step === lastRunning.step
              ? { ...l, warnings: [...(l.warnings ?? []), ev.message] }
              : l
          ),
        }
      }

      if (ev.type === 'complete') {
        return {
          ...state,
          status: 'done',
          sessionId: ev.sessionId,
          totalApproved: ev.total_approved,
          totalRequested: ev.total_requested,
        }
      }

      if (ev.type === 'error') {
        return { ...state, status: 'error', errorMessage: ev.message }
      }

      return state
    }

    case 'ERROR':
      return { ...state, status: 'error', errorMessage: action.message }

    default:
      return state
  }
}

// ── Component ──────────────────────────────────────────────────────────────

export default function GeneratePage() {
  const [state, dispatch] = useReducer(reducer, initial)
  const abortRef = useRef<AbortController | null>(null)

  async function handleSubmit(req: GenerateRequest) {
    abortRef.current?.abort()
    const ctrl = new AbortController()
    abortRef.current = ctrl

    dispatch({ type: 'START', count: req.count })

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(req),
        signal: ctrl.signal,
      })

      if (!response.ok) {
        const msg = await response.text()
        dispatch({ type: 'ERROR', message: msg || `Server error ${response.status}` })
        return
      }

      const reader = response.body!.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })

        // Process complete SSE events (delimited by \n\n)
        const parts = buffer.split('\n\n')
        buffer = parts.pop() ?? ''   // keep incomplete tail

        for (const part of parts) {
          const dataLine = part.split('\n').find((l) => l.startsWith('data: '))
          if (!dataLine) continue
          try {
            const event = JSON.parse(dataLine.slice(6)) as SSEEvent
            dispatch({ type: 'SSE', event })
          } catch {
            // malformed SSE line — skip
          }
        }
      }
    } catch (err) {
      if ((err as Error).name === 'AbortError') return
      dispatch({ type: 'ERROR', message: (err as Error).message })
    }
  }

  return (
    <div className="space-y-0">
      {/* Page title */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Math Worksheet Generator</h1>
        <p className="text-gray-500 text-sm mt-1">
          Multi-agent pipeline · Common Core aligned · Area Model / RDW / Number Line
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left: form */}
        <div className="lg:col-span-1">
          <GenerateForm
            onSubmit={handleSubmit}
            disabled={state.status === 'running'}
          />
        </div>

        {/* Right: progress + results */}
        <div className="lg:col-span-2 space-y-4">
          {state.status !== 'idle' && (
            <ProgressTracker
              logs={state.logs}
              errorMessage={state.errorMessage ?? undefined}
            />
          )}

          {state.status === 'done' && state.sessionId && (
            <ResultPreview
              sessionId={state.sessionId}
              totalApproved={state.totalApproved}
              totalRequested={state.totalRequested}
            />
          )}

          {state.status === 'idle' && (
            <div className="flex flex-col items-center justify-center h-64 rounded-2xl border-2 border-dashed border-gray-200 text-gray-400">
              <div className="text-4xl mb-3">📐</div>
              <p className="text-sm">Configure and generate problems to see results here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
