'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NewTag() {
  const [name, setName] = useState('')
  const [published, setPublished] = useState(true) // Default to published
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    if (!name.trim()) {
      setError('标签名称不能为空')
      return
    }
    const res = await fetch('/api/admin/tags', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, published })
    })
    if (res.ok) {
      router.push('/admin/tags')
    } else {
      setError('创建标签失败')
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-neutral-200">新建标签</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full p-2 rounded bg-[#181f2a] text-neutral-200 border border-[#2a3441]"
          placeholder="标签名称"
          value={name}
          onChange={e => setName(e.target.value)}
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
        <button type="submit" className="bg-red-400 hover:bg-red-400 text-neutral-200 rounded px-4 py-2 font-bold">创建</button>
      </form>
    </div>
  )
} 