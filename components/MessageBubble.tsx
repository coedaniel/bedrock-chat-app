'use client'

import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

type Props = {
  role: 'user' | 'assistant'
  content: string
}

export default function MessageBubble({ role, content }: Props) {
  const isUser = role === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-xl px-4 py-3 rounded-2xl ${
        isUser 
          ? 'bg-blue-600 text-white rounded-br-md' 
          : 'bg-gray-100 text-gray-900 rounded-bl-md'
      }`}>
        <div className="prose prose-sm max-w-none">
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            components={{
              p: ({ children }) => <p className={`mb-2 last:mb-0 ${isUser ? 'text-white' : 'text-gray-900'}`}>{children}</p>,
              code: ({ children }) => (
                <code className={`px-1 py-0.5 rounded text-sm ${
                  isUser ? 'bg-blue-700 text-blue-100' : 'bg-gray-200 text-gray-800'
                }`}>
                  {children}
                </code>
              ),
              pre: ({ children }) => (
                <pre className={`p-3 rounded-lg overflow-x-auto text-sm ${
                  isUser ? 'bg-blue-700 text-blue-100' : 'bg-gray-200 text-gray-800'
                }`}>
                  {children}
                </pre>
              ),
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  )
}
