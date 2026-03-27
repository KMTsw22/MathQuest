import { getSession } from '@/lib/session-store'

const ALLOWED_FILES = ['problems.json', 'student.html', 'teacher.html'] as const
type AllowedFile = (typeof ALLOWED_FILES)[number]

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ sessionId: string; filename: string }> }
) {
  const { sessionId, filename } = await params

  if (!ALLOWED_FILES.includes(filename as AllowedFile)) {
    return new Response('Unknown file', { status: 400 })
  }

  const session = getSession(sessionId)
  if (!session) {
    return new Response('Session not found or expired (1 hour TTL)', { status: 404 })
  }

  const fileKey = filename.replace('.', '_') as 'problems_json' | 'student_html' | 'teacher_html'
  const content = session[fileKey]

  const contentType =
    filename === 'problems.json' ? 'application/json' : 'text/html'

  return new Response(content, {
    headers: {
      'Content-Type': `${contentType}; charset=utf-8`,
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
}
