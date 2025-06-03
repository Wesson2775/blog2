'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function AdminLinks() {
  const [links, setLinks] = useState<any[]>([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch(`/api/admin/links?search=${encodeURIComponent(search)}`)
      .then(res => res.json())
      .then(data => setLinks(data))
  }, [search])

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

  const handleTogglePublish = async (link: any) => {
    const originalPublished = link.published;
    // Optimistically update UI
    setLinks(links.map((l: any) =>
      l.id === link.id ? { ...l, published: !originalPublished } : l
    ));

    const res = await fetch(`/api/admin/links/${link.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ published: !originalPublished })
    });

    if (!res.ok) {
      // Revert UI if API call fails
      setLinks(links.map((l: any) =>
        l.id === link.id ? { ...l, published: originalPublished } : l
      ));
      // Optionally show an error message
      console.error('Failed to update publish status');
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-2">
        <h1 className="text-2xl font-bold text-neutral-200">友情链接管理</h1>
        <Link href="/admin/links/new" className="bg-red-400 hover:bg-red-400 text-neutral-200 rounded px-4 py-2 font-bold text-center">新建友链</Link>
      </div>
      <div className="mb-4 flex justify-end">
        <input
          type="text"
          className="p-2 rounded bg-[#232b3b] text-neutral-200 border border-[#2a3441] w-full max-w-xs text-center"
          placeholder="搜索友链名称"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      {/* 桌面端表格，移动端隐藏 */}
      <div className="overflow-x-auto rounded-lg hidden md:block">
        <table className="min-w-full bg-[#232b3b] rounded-lg text-sm">
          <thead>
            <tr>
              <th className="p-2 text-neutral-200 whitespace-nowrap text-center">名称</th>
              <th className="p-2 text-neutral-200 whitespace-nowrap text-center">链接</th>
              <th className="p-2 text-neutral-200 whitespace-nowrap text-center">描述</th>
              <th className="p-2 text-neutral-200 whitespace-nowrap text-center">是否发布</th>
              <th className="p-2 text-neutral-200 whitespace-nowrap text-center">创建时间</th>
              <th className="p-2 text-neutral-200 whitespace-nowrap text-center">操作</th>
            </tr>
          </thead>
          <tbody>
            {links.map((link: any) => (
              <tr key={link.id} className="border-b border-[#2a3441] text-center">
                <td className="p-2 text-neutral-200">{link.name}</td>
                <td className="p-2 text-neutral-200">{link.url}</td>
                <td className="p-2 text-neutral-200">{link.description}</td>
                <td className="p-2 flex justify-center items-center">
                  <button
                    aria-label="Toggle published status"
                    title={link.published ? '已发布，点击关闭' : '未发布，点击开启'}
                    onClick={() => handleTogglePublish(link)}
                    className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400 ${link.published ? 'bg-green-400' : 'bg-gray-400'}`}
                  >
                    <span
                      aria-hidden="true"
                      className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${link.published ? 'translate-x-5' : 'translate-x-0'}`}
                    ></span>
                  </button>
                </td>
                <td className="p-2 text-neutral-200 whitespace-nowrap">{new Date(link.createdAt).toLocaleString()}</td>
                <td className="p-2 space-x-2">
                  <Link href={`/admin/links/${link.id}/edit`} className="text-blue-400 hover:underline">编辑</Link>
                  <button onClick={() => handleDelete(link.id)} className="text-red-400 hover:underline">删除</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* 移动端卡片，桌面端隐藏 */}
      <div className="md:hidden flex flex-col gap-4">
        {links.map((link: any) => (
          <div key={link.id} className="bg-[#232b3b] rounded-lg shadow p-4 flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <div className="font-bold text-base text-neutral-200">{link.name}</div>
              <button
                aria-label="Toggle published status"
                title={link.published ? '已发布，点击关闭' : '未发布，点击开启'}
                onClick={() => handleTogglePublish(link)}
                className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400 ${link.published ? 'bg-green-400' : 'bg-gray-400'}`}
              >
                <span
                  aria-hidden="true"
                  className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${link.published ? 'translate-x-5' : 'translate-x-0'}`}
                ></span>
              </button>
            </div>
            <div className="text-xs text-gray-400">链接：{link.url}</div>
            <div className="text-xs text-gray-400">描述：{link.description}</div>
            <div className="text-xs text-gray-400">创建时间：{new Date(link.createdAt).toLocaleString()}</div>
            <div className="flex gap-4 mt-2">
              <Link href={`/admin/links/${link.id}/edit`} className="text-blue-400 hover:underline">编辑</Link>
              <button onClick={() => handleDelete(link.id)} className="text-red-400 hover:underline">删除</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 