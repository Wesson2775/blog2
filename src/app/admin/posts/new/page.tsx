'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import 'bytemd/dist/index.css'

const ByteMD = dynamic<any>(() => import('@bytemd/react').then(mod => mod.default || mod.Editor), { ssr: false })

export default function NewPost() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [pinned, setPinned] = useState(false)
  const [published, setPublished] = useState(true)
  const [createdAt, setCreatedAt] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetch('/api/admin/tags').then(res => res.json()).then(setTags)
  }, [])

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    // 生成更规范的 slug，处理中文字符
    const slug = title
      .trim()
      .toLowerCase()
      .replace(/[^\w\u4e00-\u9fa5\s-]/g, '') // 保留中文、字母、数字、空格和连字符
      .replace(/\s+/g, '-') // 空格替换为连字符
      .replace(/-+/g, '-') // 多个连字符替换为单个
      + '-' + Date.now() // 添加时间戳确保唯一性
    
    const res = await fetch('/api/admin/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        content,
        tags: selectedTags,
        pinned,
        published,
        createdAt: createdAt || new Date().toISOString(),
        slug
      })
    })
    if (res.ok) {
      router.push('/admin/posts')
    } else {
      setError('保存失败')
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-neutral-200">新建文章</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full p-2 rounded bg-[#181f2a] text-gray-200 border border-[#2a3441] placeholder:text-gray-400 focus:ring-2 focus:ring-red-400"
          placeholder="标题"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
        <input
          type="datetime-local"
          className="w-full p-2 rounded bg-[#181f2a] text-gray-200 border border-[#2a3441] focus:ring-2 focus:ring-red-400"
          placeholder="日期（可选，默认当前时间）"
          value={createdAt}
          onChange={e => setCreatedAt(e.target.value)}
          style={{ colorScheme: 'dark' }}
        />
        <div className="w-full">
          <label className="block text-neutral-200 mb-2">内容 (支持 Markdown)</label>
          <div className="bg-[#232b3b] rounded overflow-hidden" style={{ minHeight: 300 }}>
            <ByteMD
              value={content}
              onChange={setContent}
              previewDebounce={0}
              previewClassName="prose dark:prose-invert max-w-none text-base"
            />
          </div>
        </div>
        <div>
          <label className="text-neutral-200 mr-2" htmlFor="tag-select">标签：</label>
          <select
            id="tag-select"
            className="bg-[#181f2a] text-gray-200 border border-[#2a3441] rounded p-1"
            value={selectedTags[0] || ''}
            onChange={e => setSelectedTags([e.target.value])}
            title="选择标签"
          >
            <option value="">请选择标签</option>
            {tags.map((tag: any) => (
              <option key={tag.id} value={tag.id}>{tag.name}</option>
            ))}
          </select>
        </div>
        <div className="flex gap-4 items-center">
          <label className="text-neutral-200 flex items-center gap-2">
            <span>是否发布</span>
            <button
              type="button"
              className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${published ? 'bg-green-400' : 'bg-gray-400'}`}
              onClick={() => setPublished(!published)}
              title={published ? '已发布，点击关闭' : '未发布，点击开启'}
            >
              <span className={`absolute left-1 top-1 w-4 h-4 rounded-full bg-white shadow-md transition-transform duration-200 ${published ? 'translate-x-5' : ''}`}></span>
            </button>
          </label>
        </div>
        {error && <div className="text-red-400">{error}</div>}
        <button type="submit" className="bg-red-400 hover:bg-red-400 text-neutral-200 rounded px-4 py-2 font-bold">保存</button>
      </form>
    </div>
  )
} 