'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function AdminPosts() {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    fetch('/api/admin/posts')
      .then(res => res.json())
      .then(data => setPosts(data))
  }, [])

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-neutral-200">文章管理</h1>
        <Link href="/admin/posts/new" className="bg-red-400 hover:bg-red-400 text-neutral-200 rounded px-4 py-2 font-bold">新建文章</Link>
      </div>
      <table className="min-w-full bg-[#232b3b] rounded-lg">
        <thead>
          <tr>
            <th className="p-2 text-neutral-200">标题</th>
            <th className="p-2 text-neutral-200">标签</th>
            <th className="p-2 text-neutral-200">置顶</th>
            <th className="p-2 text-neutral-200">发布</th>
            <th className="p-2 text-neutral-200">操作</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post: any) => (
            <tr key={post.id} className="border-b border-[#2a3441]">
              <td className="p-2 text-neutral-200">{post.title}</td>
              <td className="p-2 text-neutral-200">{post.tags?.map((t: any) => t.name).join(', ')}</td>
              <td className="p-2 text-neutral-200">{post.pinned ? '是' : '否'}</td>
              <td className="p-2">
                <span className={post.published ? 'text-green-400' : 'text-gray-400'}>
                  {post.published ? '已发布' : '未发布'}
                </span>
              </td>
              <td className="p-2 space-x-2">
                <Link href={`/admin/posts/${post.id}/edit`} className="text-blue-400 hover:underline">编辑</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
} 