'use client'

import { useState } from 'react'
import Link from 'next/link'

interface Props {
  sessionId: string
  totalApproved: number
  totalRequested: number
}

type Tab = 'student' | 'teacher'

export default function ResultPreview({ sessionId, totalApproved, totalRequested }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('student')

  const previewUrl = (file: string) => `/api/preview/${sessionId}/${file}`
  const downloadUrl = (file: string) => `/api/download/${sessionId}/${file}`

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm mt-4 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-bold text-gray-800">Results</h2>
          <p className="text-sm text-gray-500">
            {totalApproved} problem{totalApproved !== 1 ? 's' : ''} generated
            {totalApproved < totalRequested && (
              <span className="ml-1 text-orange-500">
                ({totalRequested - totalApproved} rejected)
              </span>
            )}
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-2 flex-wrap items-center">
          {/* Practice Mode — primary CTA */}
          <Link
            href={`/practice/${sessionId}`}
            className="flex items-center gap-1.5 text-sm font-bold px-4 py-2 rounded-xl
                       bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-sm"
          >
            ▶ Practice Mode
          </Link>

          <div className="w-px h-6 bg-gray-200" />

          <a
            href={downloadUrl('problems.json')}
            download="problems.json"
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg
                       bg-gray-800 text-white hover:bg-gray-700 transition-colors"
          >
            ↓ problems.json
          </a>
          <a
            href={downloadUrl('student.html')}
            download="student.html"
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg
                       bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            ↓ Student Worksheet
          </a>
          <a
            href={downloadUrl('teacher.html')}
            download="teacher.html"
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg
                       bg-green-600 text-white hover:bg-green-700 transition-colors"
          >
            ↓ Answer Key
          </a>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100">
        {(
          [
            { id: 'student' as Tab, label: 'Student Worksheet', color: 'blue' },
            { id: 'teacher' as Tab, label: 'Teacher Answer Key', color: 'green' },
          ]
        ).map(({ id, label, color }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors
              ${activeTab === id
                ? color === 'blue'
                  ? 'border-blue-500 text-blue-700'
                  : 'border-green-500 text-green-700'
                : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* iframe preview */}
      <div className="relative">
        <iframe
          key={activeTab}   // remount on tab switch
          src={previewUrl(activeTab === 'student' ? 'student.html' : 'teacher.html')}
          className="w-full border-0"
          style={{ height: '70vh', minHeight: 500 }}
          title={activeTab === 'student' ? 'Student Worksheet' : 'Teacher Answer Key'}
        />
      </div>
    </div>
  )
}
