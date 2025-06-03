'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function AdminLinks() {
  const [links, setLinks] = useState([])

  useEffect(() => {
    fetch('/api/admin/links')
      .then(res => res.json())
      .then(data => setLinks(data))
  }, [])

  const handleDelete = async (id: string) => {
    if (confirm('确定要删除吗？')) {
      const res = await fetch('/api/admin/links', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })
      if (res.ok) {
        setLinks(links.filter((link: any) => link.id !== id))
      }
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-neutral-200">友情链接管理</h1>
        <Link href="/admin/links/new" className="bg-red-400 hover:bg-red-400 text-neutral-200 rounded px-4 py-2 font-bold">新建友链</Link>
      </div>
      <table className="min-w-full bg-[#232b3b] rounded-lg">
        <thead>
          <tr>
            <th className="p-2 text-neutral-200">名称</th>
            <th className="p-2 text-neutral-200">链接</th>
            <th className="p-2 text-neutral-200">描述</th>
            <th className="p-2 text-neutral-200">操作</th>
          </tr>
        </thead>
        <tbody>
          {links.map((link: any) => (
            <tr key={link.id} className="border-b border-[#2a3441]">
              <td className="p-2 text-neutral-200">{link.name}</td>
              <td className="p-2 text-neutral-200">{link.url}</td>
              <td className="p-2 text-neutral-200">{link.description}</td>
              <td className="p-2 space-x-2">
                <Link href={`/admin/links/${link.id}/edit`} className="text-blue-400 hover:underline">编辑</Link>
                <button onClick={() => handleDelete(link.id)} className="text-red-400 hover:underline">删除</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
} 