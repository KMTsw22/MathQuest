import { getSession } from '@/lib/session-store'

/** Returns problems.json as parseable JSON for the practice page. */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const { sessionId } = await params
  const session = getSession(sessionId)

  if (!session) {
    return new Response(JSON.stringify({ error: 'Session not found or expired' }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  return new Response(session.problems_json, {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  })
}
