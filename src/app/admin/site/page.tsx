'use client'
import { useEffect, useState } from 'react'

export default function AdminSite() {
  const [config, setConfig] = useState({ title: '', description: '', notice: '' })
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/admin/site')
      .then(res => res.ok ? res.json() : { title: '', description: '', notice: '' })
      .then(setConfig)
      .catch(() => setConfig({ title: '', description: '', notice: '' }))
  }, [])

  const handleSave = async (e: any) => {
    e.preventDefault()
    const res = await fetch('/api/admin/site', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config)
    })
    if (!res.ok) setError('保存失败')
    else setError('')
  }

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-neutral-200">站点配置</h1>
      <form onSubmit={handleSave} className="space-y-4">
        <input
          className="w-full p-2 rounded bg-[#181f2a] text-neutral-200 border border-[#2a3441]"
          placeholder="站点标题"
          value={config.title}
          onChange={e => setConfig(c => ({ ...c, title: e.target.value }))}
        />
        <input
          className="w-full p-2 rounded bg-[#181f2a] text-neutral-200 border border-[#2a3441]"
          placeholder="站点描述"
          value={config.description}
          onChange={e => setConfig(c => ({ ...c, description: e.target.value }))}
        />
        <textarea
          className="w-full p-2 rounded bg-[#181f2a] text-neutral-200 border border-[#2a3441] min-h-[80px]"
          placeholder="公告（可选）"
          value={config.notice}
          onChange={e => setConfig(c => ({ ...c, notice: e.target.value }))}
        />
        {error && <div className="text-red-400">{error}</div>}
        <button type="submit" className="bg-red-400 hover:bg-red-400 text-neutral-200 rounded px-4 py-2 font-bold">保存</button>
      </form>
    </div>
  )
} 