'use client'
import { useEffect, useState } from 'react'

export default function AdminTags() {
  const [tags, setTags] = useState([])
  const [newTag, setNewTag] = useState('')
  const [error, setError] = useState('')

  const fetchTags = () => {
    fetch('/api/admin/tags').then(res => res.json()).then(setTags)
  }
  useEffect(fetchTags, [])

  const handleAdd = async (e: any) => {
    e.preventDefault()
    if (!newTag.trim()) return
    const res = await fetch('/api/admin/tags', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newTag })
    })
    if (res.ok) {
      setNewTag('')
      fetchTags()
    } else {
      setError('添加失败')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('确定删除该标签？')) return
    const res = await fetch(`/api/admin/tags/${id}`, { method: 'DELETE' })
    if (res.ok) fetchTags()
    else setError('删除失败')
  }

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-neutral-200">标签管理</h1>
      <form onSubmit={handleAdd} className="flex gap-2 mb-4">
        <input
          className="flex-1 p-2 rounded bg-[#181f2a] text-neutral-200 border border-[#2a3441]"
          placeholder="新标签名"
          value={newTag}
          onChange={e => setNewTag(e.target.value)}
        />
        <button type="submit" className="bg-red-400 hover:bg-red-400 text-neutral-200 rounded px-4 py-2 font-bold">添加</button>
      </form>
      {error && <div className="text-red-400 mb-2">{error}</div>}
      <ul className="divide-y divide-[#2a3441]">
        {tags.map((tag: any) => (
          <li key={tag.id} className="flex justify-between items-center py-2 text-neutral-200">
            <span>{tag.name}</span>
            <button onClick={() => handleDelete(tag.id)} className="text-red-400 hover:underline">删除</button>
          </li>
        ))}
      </ul>
    </div>
  )
} 