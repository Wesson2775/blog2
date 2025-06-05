'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function AdminMusic() {
  const [songs, setSongs] = useState<any[]>([])
  const [form, setForm] = useState({ title: '', artist: '', cover: '', src: '' })
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')

  const fetchSongs = () => {
    fetch('/api/admin/music')
      .then(res => res.ok ? res.json() : [])
      .then(setSongs)
      .catch(() => setSongs([]))
  }
  useEffect(() => {
    fetch(`/api/admin/music?search=${encodeURIComponent(search)}`)
      .then(res => res.json())
      .then(data => setSongs(data))
  }, [search])

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
    if (confirm('确定要删除吗？')) {
      const res = await fetch(`/api/admin/music/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setSongs(songs.filter((song: any) => song.id !== id))
      }
    }
  }

  const handleTogglePublish = async (song: any) => {
    const originalPublished = song.published;
    // Optimistically update UI
    setSongs(songs.map((s: any) =>
      s.id === song.id ? { ...s, published: !originalPublished } : s
    ));

    const res = await fetch(`/api/admin/music/${song.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ published: !originalPublished })
    });

    if (!res.ok) {
      // Revert UI if API call fails
      setSongs(songs.map((s: any) =>
        s.id === song.id ? { ...s, published: originalPublished } : s
      ));
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-2">
        <h1 className="text-2xl font-bold text-neutral-200">音乐管理</h1>
        <Link href="/admin/music/new" className="bg-red-400 hover:bg-red-400 text-neutral-200 rounded px-3 py-1.5 text-sm font-bold text-center">新建音乐</Link>
      </div>
      <div className="mb-4 flex justify-end">
        <input
          type="text"
          className="p-1.5 rounded bg-[#232b3b] text-neutral-200 border border-[#2a3441] w-full max-w-[200px] text-center text-sm"
          placeholder="搜索音乐名称"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      {/* 桌面端表格，移动端隐藏 */}
      <div className="overflow-x-auto rounded-lg hidden md:block">
        <table className="min-w-full bg-[#232b3b] rounded-lg text-sm">
          <thead>
            <tr>
              <th className="p-2 text-neutral-200 whitespace-nowrap text-center">封面</th>
              <th className="p-2 text-neutral-200 whitespace-nowrap text-center">歌曲名称</th>
              <th className="p-2 text-neutral-200 whitespace-nowrap text-center">歌手</th>
              <th className="p-2 text-neutral-200 whitespace-nowrap text-center">链接</th>
              <th className="p-2 text-neutral-200 whitespace-nowrap text-center">是否发布</th>
              <th className="p-2 text-neutral-200 whitespace-nowrap text-center">创建时间</th>
              <th className="p-2 text-neutral-200 whitespace-nowrap text-center">操作</th>
            </tr>
          </thead>
          <tbody>
            {songs.map((song: any) => (
              <tr key={song.id} className="border-b border-[#2a3441] text-center align-middle">
                <td className="p-2 flex justify-center items-center"><img src={song.cover || '/path/to/default/cover.jpg'} alt="封面" className="w-10 h-10 object-cover rounded"/></td>
                <td className="p-2 text-neutral-200 max-w-[150px]">{song.title}</td>
                <td className="p-2 text-neutral-200 max-w-[150px]">{song.artist}</td>
                <td className="p-2 text-neutral-200 max-w-[150px] truncate" title={song.src}>{song.src}</td>
                <td className="p-2 flex justify-center items-center">
                  <button
                    aria-label="Toggle published status"
                    title={song.published ? '已发布，点击关闭' : '未发布，点击开启'}
                    onClick={() => handleTogglePublish(song)}
                    className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400 ${song.published ? 'bg-green-400' : 'bg-gray-400'}`}
                  >
                    <span
                      aria-hidden="true"
                      className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${song.published ? 'translate-x-5' : 'translate-x-0'}`}
                    ></span>
                  </button>
                </td>
                <td className="p-2 text-neutral-200 whitespace-nowrap">{new Date(song.createdAt).toLocaleString()}</td>
                <td className="p-2 space-x-2">
                  <Link href={`/admin/music/${song.id}/edit`} className="text-blue-400 hover:underline">编辑</Link>
                  <button onClick={() => handleDelete(song.id)} className="text-red-400 hover:underline">删除</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* 移动端卡片，桌面端隐藏 */}
      <div className="md:hidden flex flex-col gap-4">
        {songs.map((song: any) => (
          <div key={song.id} className="bg-[#232b3b] rounded-lg shadow p-4 flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <div className="font-bold text-base text-neutral-200">{song.title}</div>
              <button
                aria-label="Toggle published status"
                title={song.published ? '已发布，点击关闭' : '未发布，点击开启'}
                onClick={() => handleTogglePublish(song)}
                className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400 ${song.published ? 'bg-green-400' : 'bg-gray-400'}`}
              >
                <span
                  aria-hidden="true"
                  className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${song.published ? 'translate-x-5' : 'translate-x-0'}`}
                ></span>
              </button>
            </div>
            <div className="flex items-center gap-2">
              <img src={song.cover || '/path/to/default/cover.jpg'} alt="封面" className="w-10 h-10 object-cover rounded"/>
              <div className="flex flex-col">
                <div className="text-xs text-gray-400">歌手：{song.artist}</div>
                <div className="text-xs text-gray-400 max-w-[250px] truncate" title={song.src}>链接：{song.src}</div>
              </div>
            </div>
            <div className="text-xs text-gray-400">创建时间：{new Date(song.createdAt).toLocaleString()}</div>
            <div className="flex gap-4 mt-2">
              <Link href={`/admin/music/${song.id}/edit`} className="text-blue-400 hover:underline">编辑</Link>
              <button onClick={() => handleDelete(song.id)} className="text-red-400 hover:underline">删除</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 