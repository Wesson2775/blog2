'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function AdminPosts() {
  const [posts, setPosts] = useState<any[]>([])
  const [search, setSearch] = useState('')

  const fetchPosts = () => {
    fetch(`/api/admin/posts?search=${encodeURIComponent(search)}`)
      .then(res => res.json())
      .then(data => setPosts(data))
  }

  const handleTogglePublish = async (post: any) => {
    const originalPublished = post.published;
    // Optimistically update UI
    setPosts(posts.map((p: any) =>
      p.id === post.id ? { ...p, published: !originalPublished } : p
    ));

    const res = await fetch(`/api/admin/posts/${post.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ published: !originalPublished })
    });

    if (!res.ok) {
      // Revert UI if API call fails
      setPosts(posts.map((p: any) =>
        p.id === post.id ? { ...p, published: originalPublished } : p
      ));
      // Optionally show an error message
      console.error('Failed to update publish status');
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [search])

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-2">
        <h1 className="text-2xl font-bold text-neutral-200">文章管理</h1>
        <Link href="/admin/posts/new" className="bg-red-400 hover:bg-red-400 text-neutral-200 rounded px-4 py-2 font-bold text-center">新建文章</Link>
      </div>
      <div className="mb-4 flex justify-end">
        <input
          type="text"
          className="p-2 rounded bg-[#232b3b] text-neutral-200 border border-[#2a3441] w-full max-w-xs text-center"
          placeholder="搜索文章标题"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      {/* 桌面端表格，移动端隐藏 */}
      <div className="overflow-x-auto rounded-lg hidden md:block">
        <table className="min-w-full bg-[#232b3b] rounded-lg text-sm">
          <thead>
            <tr>
              <th className="p-2 text-neutral-200 whitespace-nowrap text-center">标题</th>
              <th className="p-2 text-neutral-200 whitespace-nowrap text-center">标签</th>
              <th className="p-2 text-neutral-200 whitespace-nowrap text-center">是否发布</th>
              <th className="p-2 text-neutral-200 whitespace-nowrap text-center">创建时间</th>
              <th className="p-2 text-neutral-200 whitespace-nowrap text-center">操作</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post: any) => (
              <tr key={post.id} className="border-b border-[#2a3441] text-center">
                <td className="p-2 text-neutral-200 max-w-[160px] truncate">{post.title}</td>
                <td className="p-2 text-neutral-200 max-w-[120px] truncate">{post.tags?.map((t: any) => t.name).join(', ')}</td>
                <td className="p-2 flex justify-center items-center">
                  <button
                    aria-label="Toggle published status"
                    title={post.published ? '已发布，点击关闭' : '未发布，点击开启'}
                    onClick={() => handleTogglePublish(post)}
                    className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400 ${post.published ? 'bg-green-400' : 'bg-gray-400'}`}
                  >
                    <span
                      aria-hidden="true"
                      className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${post.published ? 'translate-x-5' : 'translate-x-0'}`}
                    ></span>
                  </button>
                </td>
                <td className="p-2 text-neutral-200 whitespace-nowrap">{post.createdAt ? new Date(post.createdAt).toLocaleString() : ''}</td>
                <td className="p-2 flex flex-wrap gap-2 justify-center">
                  <Link href={`/admin/posts/${post.id}/edit`} className="text-blue-400 hover:underline">编辑</Link>
                  <button onClick={async () => {
                    if (confirm('确定要删除这篇文章吗？')) {
                      await fetch(`/api/admin/posts`, {
                        method: 'DELETE',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ id: post.id })
                      })
                      setPosts(posts.filter((p: any) => p.id !== post.id))
                    }
                  }} className="text-red-400 hover:underline">删除</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* 移动端卡片，桌面端隐藏 */}
      <div className="md:hidden flex flex-col gap-4">
        {posts.map((post: any) => (
          <div key={post.id} className="bg-[#232b3b] rounded-lg shadow p-4 flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <div className="font-bold text-base text-neutral-200 truncate">{post.title}</div>
              <button
                aria-label="Toggle published status"
                title={post.published ? '已发布，点击关闭' : '未发布，点击开启'}
                onClick={() => handleTogglePublish(post)}
                className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400 ${post.published ? 'bg-green-400' : 'bg-gray-400'}`}
              >
                <span
                  aria-hidden="true"
                  className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${post.published ? 'translate-x-5' : 'translate-x-0'}`}
                ></span>
              </button>
            </div>
            <div className="flex flex-wrap gap-2 text-sm text-gray-400">
              {post.tags?.map((t: any) => (
                <span key={t.id} className="bg-[#181f2a] px-2 py-0.5 rounded-full">{t.name}</span>
              ))}
            </div>
            <div className="text-xs text-gray-400">创建时间：{post.createdAt ? new Date(post.createdAt).toLocaleString() : ''}</div>
            <div className="flex gap-4 mt-2">
              <Link href={`/admin/posts/${post.id}/edit`} className="text-blue-400 hover:underline">编辑</Link>
              <button onClick={async () => {
                if (confirm('确定要删除这篇文章吗？')) {
                  await fetch(`/api/admin/posts`, {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: post.id })
                  })
                  setPosts(posts.filter((p: any) => p.id !== post.id))
                }
              }} className="text-red-400 hover:underline">删除</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 