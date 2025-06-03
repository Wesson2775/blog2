'use client'
import { useEffect, useState } from 'react'

export default function AdminMusic() {
  const [songs, setSongs] = useState([])
  const [form, setForm] = useState({ title: '', artist: '', cover: '', src: '' })
  const [error, setError] = useState('')

  const fetchSongs = () => {
    fetch('/api/admin/music')
      .then(res => res.ok ? res.json() : [])
      .then(setSongs)
      .catch(() => setSongs([]))
  }
  useEffect(fetchSongs, [])

  const handleAdd = async (e: any) => {
    e.preventDefault()
    if (!form.title || !form.src) return
    const res = await fetch('/api/admin/music', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    })
    if (res.ok) {
      setForm({ title: '', artist: '', cover: '', src: '' })
      fetchSongs()
    } else {
      setError('添加失败')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('确定删除该音乐？')) return
    const res = await fetch(`/api/admin/music/${id}`, { method: 'DELETE' })
    if (res.ok) fetchSongs()
    else setError('删除失败')
  }

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-neutral-200">音乐管理</h1>
      <form onSubmit={handleAdd} className="space-y-2 mb-4">
        <input
          className="w-full p-2 rounded bg-[#181f2a] text-neutral-200 border border-[#2a3441]"
          placeholder="歌名"
          value={form.title}
          onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
        />
        <input
          className="w-full p-2 rounded bg-[#181f2a] text-neutral-200 border border-[#2a3441]"
          placeholder="歌手"
          value={form.artist}
          onChange={e => setForm(f => ({ ...f, artist: e.target.value }))}
        />
        <input
          className="w-full p-2 rounded bg-[#181f2a] text-neutral-200 border border-[#2a3441]"
          placeholder="封面图片URL"
          value={form.cover}
          onChange={e => setForm(f => ({ ...f, cover: e.target.value }))}
        />
        <input
          className="w-full p-2 rounded bg-[#181f2a] text-neutral-200 border border-[#2a3441]"
          placeholder="音频文件URL"
          value={form.src}
          onChange={e => setForm(f => ({ ...f, src: e.target.value }))}
        />
        <button type="submit" className="bg-red-400 hover:bg-red-400 text-neutral-200 rounded px-4 py-2 font-bold">添加</button>
      </form>
      {error && <div className="text-red-400 mb-2">{error}</div>}
      <ul className="divide-y divide-[#2a3441]">
        {songs.map((song: any) => (
          <li key={song.id} className="flex justify-between items-center py-2 text-neutral-200">
            <span>{song.title} <span className="text-gray-400">{song.artist}</span></span>
            <button onClick={() => handleDelete(song.id)} className="text-red-400 hover:underline">删除</button>
          </li>
        ))}
      </ul>
    </div>
  )
} 