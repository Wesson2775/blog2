'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import 'bytemd/dist/index.css'

const ByteMD = dynamic(() => import('@bytemd/react').then(mod => mod.Editor), { 
  ssr: false,
  loading: () => <div className="h-[300px] bg-[#232b3b] rounded animate-pulse" />
})

export default function EditPost({ params }: { params: { id: string } }) {
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
    const fetchPost = async () => {
      try {
        const response = await fetch(`/api/admin/posts/${params.id}`)
        const data = await response.json()
        setTitle(data.title)
        setContent(data.content)
        setSelectedTags(data.tags.map((t: any) => t.id))
        setPinned(data.pinned)
        setPublished(data.published)
        setCreatedAt(new Date(data.createdAt).toISOString().slice(0, 16))
      } catch (error) {
        console.error('获取文章失败:', error)
      }
    }

    const fetchTags = async () => {
      try {
        const response = await fetch('/api/admin/tags')
        const data = await response.json()
        setTags(data)
      } catch (error) {
        console.error('获取标签失败:', error)
      }
    }

    fetchPost()
    fetchTags()
  }, [params.id])

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    const res = await fetch(`/api/admin/posts/${params.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        content,
        tags: selectedTags,
        published,
        createdAt: createdAt || new Date().toISOString()
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
      <h1 className="text-2xl font-bold mb-6 text-neutral-200">编辑文章</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full p-2 rounded bg-[#181f2a] text-neutral-200 border border-[#2a3441]"
          placeholder="标题"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
        <input
          type="datetime-local"
          className="w-full p-2 rounded bg-[#181f2a] text-neutral-200 border border-[#2a3441]"
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
        <div className="flex items-center space-x-4">
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
        <div className="flex space-x-4">
          <button type="submit" className="bg-red-400 hover:bg-red-400 text-neutral-200 rounded px-4 py-2 font-bold">保存</button>
          <button type="button" onClick={() => router.push('/admin/posts')} className="bg-gray-400 hover:bg-gray-500 text-neutral-200 rounded px-4 py-2 font-bold">取消</button>
        </div>
      </form>
    </div>
  )
}
