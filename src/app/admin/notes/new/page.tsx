'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NewNote() {
  const [content, setContent] = useState('')
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
        published,
        createdAt: createdAt ? new Date(createdAt).toISOString() : new Date().toISOString(),
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
      <h1 className="text-2xl font-bold mb-6 text-neutral-200">新建笔记</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="datetime-local"
          className="w-full p-2 rounded bg-[#181f2a] text-neutral-200 border border-[#2a3441] text-neutral-400"
          placeholder="日期（可选，默认当前时间）"
          value={createdAt}
          onChange={e => setCreatedAt(e.target.value)}
        />
        <textarea
          className="w-full p-2 rounded bg-[#181f2a] text-neutral-200 border border-[#2a3441] min-h-[120px]"
          placeholder="内容 (支持 Markdown)"
          value={content}
          onChange={e => setContent(e.target.value)}
          required
        />
        <div className="flex gap-4 items-center">
          <span className="text-neutral-200">是否发布</span>
          <button
            type="button"
            aria-label="Toggle published status"
            onClick={() => setPublished(!published)}
            className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400 ${published ? 'bg-green-400' : 'bg-gray-400'}`}
            title={published ? '已发布，点击关闭' : '未发布，点击开启'}
          >
            <span
              aria-hidden="true"
              className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${published ? 'translate-x-5' : 'translate-x-0'}`}
            ></span>
          </button>
        </div>
        {error && <div className="text-red-400">{error}</div>}
        <div className="flex gap-4">
          <button type="submit" className="bg-red-400 hover:bg-red-400 text-neutral-200 rounded px-4 py-2 font-bold">保存</button>
          <button type="button" onClick={() => router.push('/admin/notes')} className="bg-gray-400 hover:bg-gray-500 text-neutral-200 rounded px-4 py-2 font-bold">取消</button>
        </div>
      </form>
    </div>
  )
} 