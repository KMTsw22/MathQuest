const TTL_MS = 60 * 60 * 1000 // 1 hour

interface SessionFiles {
  problems_json: string
  student_html: string
  teacher_html: string
  createdAt: number
}

// Module-level singleton — persists across requests within the same process.
// For multi-instance / serverless deployments, swap this for Redis or /tmp.
const store = new Map<string, SessionFiles>()

export function saveSession(
  sessionId: string,
  files: Omit<SessionFiles, 'createdAt'>
): void {
  store.set(sessionId, { ...files, createdAt: Date.now() })
}

export function getSession(sessionId: string): SessionFiles | undefined {
  return store.get(sessionId)
}

/** Lazy TTL cleanup — called at the start of each new generate request. */
export function purgeOldSessions(): void {
  const now = Date.now()
  for (const [id, session] of store.entries()) {
    if (now - session.createdAt > TTL_MS) {
      store.delete(id)
    }
  }
}

export function generateSessionId(): string {
  return crypto.randomUUID()
}
