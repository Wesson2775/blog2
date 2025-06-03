'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import 'bytemd/dist/index.css'

const ByteMD = dynamic<any>(() => import('@bytemd/react').then(mod => mod.default || mod.Editor), { ssr: false })

export default function EditPost() {
  const router = useRouter()
  const params = useParams()
  const id = params?.id as string
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [tags, setTags] = useState([])
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [pinned, setPinned] = useState(false)
  const [published, setPublished] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/admin/tags').then(res => res.json()).then(setTags)
    fetch(`/api/admin/posts/${id}`).then(res => res.json()).then(data => {
      setTitle(data.title)
      setContent(data.content)
      setSelectedTags(data.tags.map((t: any) => t.id))
      setPinned(data.pinned)
      setPublished(data.published)
    })
  }, [id])

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    const res = await fetch(`/api/admin/posts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content, tags: selectedTags, pinned, published })
    })
    if (res.ok) {
      router.push('/admin/posts')
    } else {
      setError('保存失败')
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-neutral-200">编辑文章</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full p-2 rounded bg-[#181f2a] text-gray-200 border border-[#2a3441] placeholder:text-gray-400 focus:ring-2 focus:ring-red-400"
          placeholder="标题"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
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