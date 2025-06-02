'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NewLink() {
  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    const res = await fetch('/api/admin/links', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, url, description })
    })
    if (res.ok) {
      router.push('/admin/links')
    } else {
      setError('保存失败')
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-white">新建友情链接</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full p-2 rounded bg-[#181f2a] text-white border border-[#2a3441]"
          placeholder="名称"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <input
          className="w-full p-2 rounded bg-[#181f2a] text-white border border-[#2a3441]"
          placeholder="链接"
          value={url}
          onChange={e => setUrl(e.target.value)}
          required
        />
        <input
          className="w-full p-2 rounded bg-[#181f2a] text-white border border-[#2a3441]"
          placeholder="描述"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
        {error && <div className="text-red-400">{error}</div>}
        <button type="submit" className="bg-red-500 hover:bg-red-600 text-white rounded px-4 py-2 font-bold">保存</button>
      </form>
    </div>
  )
} 