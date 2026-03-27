import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'MathMultiAgent — Worksheet Generator',
  description: 'AI-powered US math problem generator with Common Core alignment',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-gray-900 antialiased">
        <header className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-5xl mx-auto px-4 h-14 flex items-center gap-3">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
              M
            </div>
            <span className="font-bold text-gray-800">MathMultiAgent</span>
            <span className="text-gray-400 text-sm">/ Worksheet Generator</span>
          </div>
        </header>
        <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  )
}
