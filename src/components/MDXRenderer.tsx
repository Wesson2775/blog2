'use client'

import { MDXRemote } from 'next-mdx-remote'
import type { MDXRemoteSerializeResult } from 'next-mdx-remote'

interface MDXRendererProps {
  source: MDXRemoteSerializeResult
}

export default function MDXRenderer({ source }: MDXRendererProps) {
  return (
    <div className="prose dark:prose-invert max-w-none">
      <MDXRemote {...source} />
    </div>
  )
} 