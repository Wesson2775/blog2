'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

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
        slug: title.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now()
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
      <h1 className="text-2xl font-bold mb-6 text-white">新建文章</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full p-2 rounded bg-[#181f2a] text-white border border-[#2a3441]"
          placeholder="标题"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
        <input
          type="datetime-local"
          className="w-full p-2 rounded bg-[#181f2a] text-white border border-[#2a3441]"
          placeholder="日期（可选，默认当前时间）"
          value={createdAt}
          onChange={e => setCreatedAt(e.target.value)}
        />
        <textarea
          className="w-full p-2 rounded bg-[#181f2a] text-white border border-[#2a3441] min-h-[120px]"
          placeholder="内容 (支持 Markdown)"
          value={content}
          onChange={e => setContent(e.target.value)}
          required
        />
        <div>
          <label className="text-white mr-2" htmlFor="tag-select">标签：</label>
          <select
            id="tag-select"
            multiple
            className="bg-[#181f2a] text-white border border-[#2a3441] rounded p-1"
            value={selectedTags}
            onChange={e => setSelectedTags(Array.from(e.target.selectedOptions, o => o.value as string))}
            title="选择标签"
          >
            {tags.map((tag: any) => (
              <option key={tag.id} value={tag.id}>{tag.name}</option>
            ))}
          </select>
        </div>
        <div className="flex gap-4 items-center">
          <label className="text-white flex items-center gap-1">
            <input type="checkbox" checked={pinned} onChange={e => setPinned(e.target.checked)} /> 置顶
          </label>
          <label className="text-white flex items-center gap-1">
            <input type="checkbox" checked={published} onChange={e => setPublished(e.target.checked)} /> 发布
          </label>
        </div>
        {error && <div className="text-red-400">{error}</div>}
        <button type="submit" className="bg-red-500 hover:bg-red-600 text-white rounded px-4 py-2 font-bold">保存</button>
      </form>
    </div>
  )
} 