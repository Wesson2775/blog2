'use client'

import dynamic from 'next/dynamic'

const ByteMD = dynamic(() => import('@bytemd/react').then(mod => mod.Viewer), {
  ssr: false,
  loading: () => <div className="animate-pulse bg-neutral-800 h-96 rounded"></div>
})

interface MarkdownViewerProps {
  content: string
}

export default function MarkdownViewer({ content }: MarkdownViewerProps) {
  return (
    <div className="markdown-body">
      <ByteMD value={content} />
    </div>
  )
} 