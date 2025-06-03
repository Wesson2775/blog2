'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function SiteConfig() {
  const [title, setTitle] = useState('')
  const [subtitle, setSubtitle] = useState('')
  const [github, setGithub] = useState('')
  const [email, setEmail] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetch('/api/admin/site')
      .then(res => res.json())
      .then(data => {
        setTitle(data.title || '')
        setSubtitle(data.subtitle || '')
        setGithub(data.github || '')
        setEmail(data.email || '')
        setDescription(data.description || '')
      })
  }, [])

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    const res = await fetch('/api/admin/site', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        subtitle,
        github,
        email,
        description
      })
    })
    if (res.ok) {
      router.push('/admin/site')
    } else {
      const data = await res.json()
      setError(data.error || '保存失败')
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-neutral-200">站点配置</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-neutral-200 mb-2">博客名称</label>
          <input
            className="w-full p-2 rounded bg-[#181f2a] text-neutral-200 border border-[#2a3441]"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            title="博客名称"
            placeholder="请输入博客名称"
          />
        </div>
        <div>
          <label className="block text-neutral-200 mb-2">副标题</label>
          <input
            className="w-full p-2 rounded bg-[#181f2a] text-neutral-200 border border-[#2a3441]"
            value={subtitle}
            onChange={e => setSubtitle(e.target.value)}
            required
            title="副标题"
            placeholder="请输入副标题"
          />
        </div>
        <div>
          <label className="block text-neutral-200 mb-2">GitHub</label>
          <input
            className="w-full p-2 rounded bg-[#181f2a] text-neutral-200 border border-[#2a3441]"
            value={github}
            onChange={e => setGithub(e.target.value)}
            required
            title="GitHub 链接"
            placeholder="请输入 GitHub 链接"
          />
        </div>
        <div>
          <label className="block text-neutral-200 mb-2">邮箱</label>
          <input
            className="w-full p-2 rounded bg-[#181f2a] text-neutral-200 border border-[#2a3441]"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            title="联系邮箱"
            placeholder="请输入联系邮箱"
          />
        </div>
        <div>
          <label className="block text-neutral-200 mb-2">简介</label>
          <textarea
            className="w-full p-2 rounded bg-[#181f2a] text-neutral-200 border border-[#2a3441] min-h-[120px]"
            value={description}
            onChange={e => setDescription(e.target.value)}
            required
            title="博客简介"
            placeholder="请输入博客简介"
          />
        </div>
        {error && <div className="text-red-400">{error}</div>}
        <button type="submit" className="bg-red-400 hover:bg-red-400 text-neutral-200 rounded px-4 py-2 font-bold">保存</button>
      </form>
    </div>
  )
} 