'use client'

import { useState } from 'react'
import { marked } from 'marked'

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  minHeight?: string
}

export default function MarkdownEditor({
  value,
  onChange,
  placeholder = 'Write your content in Markdown...',
  minHeight = '400px'
}: MarkdownEditorProps) {
  const [isPreview, setIsPreview] = useState(false)

  // Configure marked for secure HTML
  marked.setOptions({
    breaks: true,
    gfm: true,
  })

  const renderMarkdown = (markdown: string) => {
    try {
      return marked(markdown)
    } catch (error) {
      console.error('Error rendering markdown:', error)
      return '<p>Error rendering markdown</p>'
    }
  }

  return (
    <div className="markdown-editor">
      <div className="flex items-center justify-between mb-2">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setIsPreview(false)}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              !isPreview
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Write
          </button>
          <button
            type="button"
            onClick={() => setIsPreview(true)}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              isPreview
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Preview
          </button>
        </div>
        <div className="text-sm text-gray-500">
          Supports Markdown formatting
        </div>
      </div>

      {!isPreview ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent font-mono text-sm"
          style={{ minHeight }}
        />
      ) : (
        <div
          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white prose prose-sm max-w-none overflow-auto"
          style={{ minHeight }}
          dangerouslySetInnerHTML={{ __html: renderMarkdown(value) }}
        />
      )}

      <div className="mt-2 text-xs text-gray-500">
        <details>
          <summary className="cursor-pointer hover:text-gray-700">
            Markdown cheatsheet
          </summary>
          <div className="mt-2 p-3 bg-gray-50 rounded-md space-y-1">
            <div><code># Heading 1</code></div>
            <div><code>## Heading 2</code></div>
            <div><code>**bold text**</code></div>
            <div><code>*italic text*</code></div>
            <div><code>[Link text](https://example.com)</code></div>
            <div><code>![Alt text](image-url.jpg)</code></div>
            <div><code>- List item</code></div>
            <div><code>1. Numbered item</code></div>
            <div><code>`inline code`</code></div>
            <div><code>```code block```</code></div>
          </div>
        </details>
      </div>
    </div>
  )
}