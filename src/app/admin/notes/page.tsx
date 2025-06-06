'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'

export default function AdminNotes() {
  const [notes, setNotes] = useState<any[]>([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch(`/api/admin/notes?search=${encodeURIComponent(search)}`)
      .then(res => res.json())
      .then(data => setNotes(data))
  }, [search])

  const handleDelete = async (id: string) => {
    if (confirm('确定要删除吗？')) {
      const res = await fetch(`/api/admin/notes/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setNotes(notes.filter((note: any) => note.id !== id))
      }
    }
  }

  const handleTogglePublish = async (note: any) => {
    const originalPublished = note.published;
    // Optimistically update UI
    setNotes(notes.map((n: any) =>
      n.id === note.id ? { ...n, published: !originalPublished } : n
    ));

    const res = await fetch(`/api/admin/notes/${note.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ published: !originalPublished })
    });

    if (!res.ok) {
      // Revert UI if API call fails
      setNotes(notes.map((n: any) =>
        n.id === note.id ? { ...n, published: originalPublished } : n
      ));
      // Optionally show an error message
      console.error('Failed to update publish status');
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-2">
        <h1 className="text-2xl font-bold text-neutral-200">笔记管理</h1>
        <Link href="/admin/notes/new" className="bg-red-400 hover:bg-red-400 text-neutral-200 rounded px-4 py-2 font-bold text-center">新建笔记</Link>
      </div>
      <div className="mb-4 flex justify-end">
        <input
          type="text"
          className="p-2 rounded bg-[#232b3b] text-neutral-200 border border-[#2a3441] w-full max-w-xs text-center"
          placeholder="搜索笔记内容"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      {/* 桌面端表格，移动端隐藏 */}
      <div className="overflow-x-auto rounded-lg hidden md:block">
        <table className="min-w-full bg-[#232b3b] rounded-lg text-sm">
          <thead>
            <tr>
              <th className="p-2 text-neutral-200 whitespace-nowrap text-center">内容</th>
              <th className="p-2 text-neutral-200 whitespace-nowrap text-center">创建时间</th>
              <th className="p-2 text-neutral-200 whitespace-nowrap text-center">是否发布</th>
              <th className="p-2 text-neutral-200 whitespace-nowrap text-center">操作</th>
            </tr>
          </thead>
          <tbody>
            {notes.map((note: any) => (
              <tr key={note.id} className="border-b border-[#2a3441] text-center">
                <td className="p-2 text-neutral-200 max-w-[160px] truncate">{note.content}</td>
                <td className="p-2 text-neutral-200 whitespace-nowrap">{format(new Date(note.createdAt), 'yyyy/MM/dd HH:mm:ss', { locale: zhCN })}</td>
                <td className="p-2 flex justify-center items-center">
                  <button
                    className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400 ${note.published ? 'bg-green-400' : 'bg-gray-400'}`}
                    aria-label="Toggle published status"
                    title={note.published ? '已发布，点击关闭' : '未发布，点击开启'}
                    onClick={() => handleTogglePublish(note)}
                  >
                    <span
                      aria-hidden="true"
                      className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${note.published ? 'translate-x-5' : 'translate-x-0'}`}
                    ></span>
                  </button>
                </td>
                <td className="p-2 space-x-2">
                  <Link href={`/admin/notes/${note.id}/edit`} className="text-blue-400 hover:underline">编辑</Link>
                  <button onClick={() => handleDelete(note.id)} className="text-red-400 hover:underline">删除</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* 移动端卡片，桌面端隐藏 */}
      <div className="md:hidden flex flex-col gap-4">
        {notes.map((note: any) => (
          <div key={note.id} className="bg-[#232b3b] rounded-lg shadow p-4 flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <div className="font-bold text-base text-neutral-200 truncate">{note.content}</div>
              <button
                className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400 ${note.published ? 'bg-green-400' : 'bg-gray-400'}`}
                aria-label="Toggle published status"
                title={note.published ? '已发布，点击关闭' : '未发布，点击开启'}
                onClick={() => handleTogglePublish(note)}
              >
                <span
                  aria-hidden="true"
                  className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${note.published ? 'translate-x-5' : 'translate-x-0'}`}
                ></span>
              </button>
            </div>
            <div className="text-xs text-gray-400">创建时间：{format(new Date(note.createdAt), 'yyyy/MM/dd HH:mm:ss', { locale: zhCN })}</div>
            <div className="flex gap-4 mt-2">
              <Link href={`/admin/notes/${note.id}/edit`} className="text-blue-400 hover:underline">编辑</Link>
              <button onClick={() => handleDelete(note.id)} className="text-red-400 hover:underline">删除</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 