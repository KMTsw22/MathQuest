import { getSession } from '@/lib/session-store'

/** Same as download but without Content-Disposition — used for iframe preview. */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ sessionId: string; filename: string }> }
) {
  const { sessionId, filename } = await params

  const session = getSession(sessionId)
  if (!session) {
    return new Response('<p>Session expired</p>', {
      status: 404,
      headers: { 'Content-Type': 'text/html' },
    })
  }

  const fileKey = filename.replace('.', '_') as 'student_html' | 'teacher_html'
  const content = session[fileKey]
  if (!content) {
    return new Response('<p>File not found</p>', {
      status: 404,
      headers: { 'Content-Type': 'text/html' },
    })
  }

  return new Response(content, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}
