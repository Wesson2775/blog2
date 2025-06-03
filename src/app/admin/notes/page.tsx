'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function AdminNotes() {
  const [notes, setNotes] = useState([])

  useEffect(() => {
    fetch('/api/admin/notes')
      .then(res => res.json())
      .then(data => setNotes(data))
  }, [])

  const handleDelete = async (id: string) => {
    if (confirm('确定要删除吗？')) {
      const res = await fetch(`/api/admin/notes/${id}`, { method: 'DELETE' })
      if (res.ok) {
        setNotes(notes.filter((note: any) => note.id !== id))
      }
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-neutral-200">笔记管理</h1>
        <Link href="/admin/notes/new" className="bg-red-400 hover:bg-red-400 text-neutral-200 rounded px-4 py-2 font-bold">新建笔记</Link>
      </div>
      <table className="min-w-full bg-[#232b3b] rounded-lg">
        <thead>
          <tr>
            <th className="p-2 text-neutral-200">时间</th>
            <th className="p-2 text-neutral-200">内容</th>
            <th className="p-2 text-neutral-200">置顶</th>
            <th className="p-2 text-neutral-200">发布</th>
            <th className="p-2 text-neutral-200">操作</th>
          </tr>
        </thead>
        <tbody>
          {notes.map((note: any) => (
            <tr key={note.id} className="border-b border-[#2a3441]">
              <td className="p-2 text-neutral-200">{new Date(note.createdAt).toLocaleString()}</td>
              <td className="p-2 text-neutral-200">{note.content}</td>
              <td className="p-2 text-neutral-200">{note.pinned ? '是' : '否'}</td>
              <td className="p-2">
                <span className={note.published ? 'text-green-400' : 'text-gray-400'}>
                  {note.published ? '已发布' : '未发布'}
                </span>
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
  )
} 