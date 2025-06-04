'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface Tag {
  id: string
  name: string
  published: boolean
  createdAt: Date
  _count: {
    posts: number
  }
}

export default function Sidebar() {
  const [tags, setTags] = useState<Tag[]>([])
  const [siteConfig, setSiteConfig] = useState({
    title: '',
    subtitle: '',
    github: '',
    email: ''
  })

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

    const fetchSiteConfig = async () => {
      try {
        const response = await fetch('/api/admin/site')
        const data = await response.json()
        setSiteConfig(data)
      } catch (error) {
        console.error('获取站点配置失败:', error)
      }
    }

    fetchTags()
    fetchSiteConfig()
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
            className="rounded-full"
          />
        </div>
        <h1 className="text-xl font-bold text-neutral-200 mb-2">{siteConfig.title || ''}</h1>
        <p className="text-sm text-gray-400">
          {siteConfig.subtitle || ''}
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
        {siteConfig.github && (
          <a
            href={siteConfig.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-red-400"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </a>
        )}
        {siteConfig.email && (
          <a
            href={`mailto:${siteConfig.email}`}
            className="text-gray-400 hover:text-red-400"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M0 3v18h24v-18h-24zm21.518 2l-9.518 7.713-9.518-7.713h19.036zm-19.518 14v-11.817l10 8.104 10-8.104v11.817h-20z"/>
            </svg>
          </a>
        )}
      </div>
    </div>
  )
} 