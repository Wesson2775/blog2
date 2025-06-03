'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { useRouter } from 'next/navigation'

export default function AdminTags() {
  const [tags, setTags] = useState<any[]>([])
  const [newTag, setNewTag] = useState('')
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const router = useRouter()

  const fetchTags = () => {
    fetch('/api/admin/tags').then(res => res.json()).then(setTags)
  }
  useEffect(() => {
    fetch('/api/admin/tags').then(res => res.json()).then(setTags)
  }, [])

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
    if (!confirm('确定要删除这个标签吗？')) return
    const res = await fetch(`/api/admin/tags/${id}`, {
      method: 'DELETE'
    })
    if (res.ok) {
      fetchTags()
    } else {
      setError('删除失败')
    }
  }

  const handleTogglePublished = async (id: string, published: boolean) => {
    const res = await fetch(`/api/admin/tags/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ published: !published })
    })
    if (res.ok) {
      fetchTags()
    } else {
      setError('更新失败')
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-2">
        <h1 className="text-2xl font-bold text-neutral-200">标签管理</h1>
        <Link href="/admin/tags/new" className="bg-red-400 hover:bg-red-400 text-neutral-200 rounded px-4 py-2 font-bold text-center">新建标签</Link>
      </div>
      <div className="mb-4 flex justify-end">
        <input
          type="text"
          className="p-2 rounded bg-[#232b3b] text-neutral-200 border border-[#2a3441] w-full max-w-xs text-center"
          placeholder="搜索标签名称"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      {/* 桌面端表格，移动端隐藏 */}
      <div className="overflow-x-auto rounded-lg hidden md:block">
        <table className="min-w-full bg-[#232b3b] rounded-lg text-sm">
          <thead>
            <tr>
              <th className="p-2 text-neutral-200 whitespace-nowrap text-center">标签名称</th>
              <th className="p-2 text-neutral-200 whitespace-nowrap text-center">关联文章数</th>
              <th className="p-2 text-neutral-200 whitespace-nowrap text-center">是否发布</th>
              <th className="p-2 text-neutral-200 whitespace-nowrap text-center">创建时间</th>
              <th className="p-2 text-neutral-200 whitespace-nowrap text-center">操作</th>
            </tr>
          </thead>
          <tbody>
            {tags.map((tag: any) => (
              <tr key={tag.id} className="border-b border-[#2a3441] text-center">
                <td className="p-2 text-neutral-200">{tag.name}</td>
                <td className="p-2 text-neutral-200">{tag._count?.posts || 0}</td>
                <td className="p-2 flex justify-center items-center">
                  <button
                    aria-label="Toggle published status"
                    title={tag.published ? '已发布，点击关闭' : '未发布，点击开启'}
                    onClick={() => handleTogglePublished(tag.id, tag.published)}
                    className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400 ${tag.published ? 'bg-green-400' : 'bg-gray-400'}`}
                  >
                    <span
                      aria-hidden="true"
                      className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${tag.published ? 'translate-x-5' : 'translate-x-0'}`}
                    ></span>
                  </button>
                </td>
                <td className="p-2 text-neutral-200 whitespace-nowrap">{new Date(tag.createdAt).toLocaleString()}</td>
                <td className="p-2 space-x-2">
                  <Link href={`/admin/tags/${tag.id}/edit`} className="text-blue-400 hover:underline">编辑</Link>
                  <button onClick={() => handleDelete(tag.id)} className="text-red-400 hover:underline">删除</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* 移动端卡片，桌面端隐藏 */}
      <div className="md:hidden flex flex-col gap-4">
        {tags.map((tag: any) => (
          <div key={tag.id} className="bg-[#232b3b] rounded-lg shadow p-4 flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <div className="font-bold text-base text-neutral-200">{tag.name}</div>
              <button
                aria-label="Toggle published status"
                title={tag.published ? '已发布，点击关闭' : '未发布，点击开启'}
                onClick={() => handleTogglePublished(tag.id, tag.published)}
                className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400 ${tag.published ? 'bg-green-400' : 'bg-gray-400'}`}
              >
                <span
                  aria-hidden="true"
                  className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${tag.published ? 'translate-x-5' : 'translate-x-0'}`}
                ></span>
              </button>
            </div>
            <div className="text-xs text-gray-400">关联文章数：{tag._count?.posts || 0}</div>
            <div className="text-xs text-gray-400">创建时间：{new Date(tag.createdAt).toLocaleString()}</div>
            <div className="flex gap-4 mt-2">
              <Link href={`/admin/tags/${tag.id}/edit`} className="text-blue-400 hover:underline">编辑</Link>
              <button onClick={() => handleDelete(tag.id)} className="text-red-400 hover:underline">删除</button>
            </div>
          </div>
        ))}
      </div>
      {error && <div className="text-red-400 mt-4">{error}</div>}
    </div>
  )
} 