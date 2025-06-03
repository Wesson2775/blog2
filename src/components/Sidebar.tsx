'use client'

import Image from 'next/image'
import Link from 'next/link'
import { Github, Mail } from 'lucide-react'
import { useEffect, useState } from 'react'

interface Tag {
  id: string
  name: string
  _count: {
    posts: number
  }
}

export default function Sidebar() {
  const [tags, setTags] = useState<Tag[]>([])

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await fetch('/api/tags')
        const data = await response.json()
        setTags(data)
      } catch (error) {
        console.error('获取标签失败:', error)
      }
    }

    fetchTags()
  }, [])

  return (
    <div className="w-full p-6">
      {/* 头像和博客信息 */}
      <div className="flex flex-col mb-8">
        <div className="mb-4">
          <Image
            src="/512x512.png"
            alt="Avatar"
            width={64}
            height={64}
            className="rounded-full mx-auto"
          />
        </div>
        <h1 className="text-xl font-bold text-neutral-200 mb-2">只抄</h1>
        <p className="text-sm text-gray-400">
          个人技术博客，分享技术探索和生活感悟
        </p>
      </div>

      {/* 标签云 */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-neutral-200 mb-4">标签</h2>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Link
              key={tag.id}
              href={`/tags/${tag.name}`}
              className="px-3 py-1 bg-[#2a3441] text-gray-300 rounded-full text-sm hover:bg-[#3a4451]"
            >
              {tag.name} ({tag._count.posts})
            </Link>
          ))}
        </div>
      </div>

      {/* 社交链接 */}
      <div className="flex space-x-4">
        <a
          href="https://github.com/yourusername"
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-400 hover:text-neutral-200 transition-colors"
        >
          <Github size={24} />
        </a>
        <a
          href="mailto:your.email@example.com"
          className="text-gray-400 hover:text-neutral-200 transition-colors"
        >
          <Mail size={24} />
        </a>
      </div>
    </div>
  )
} 