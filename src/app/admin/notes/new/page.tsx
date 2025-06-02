'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NewNote() {
  const [content, setContent] = useState('')
  const [pinned, setPinned] = useState(false)
  const [published, setPublished] = useState(true)
  const [createdAt, setCreatedAt] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    const res = await fetch('/api/admin/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content,
        pinned,
        published,
        createdAt: createdAt || new Date().toISOString(),
        slug: 'note-' + Date.now()
      })
    })
    if (res.ok) {
      router.push('/admin/notes')
    } else {
      setError('保存失败')
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-white">新建笔记</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
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