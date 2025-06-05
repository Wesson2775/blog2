'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function EditMusic({ params }: { params: { id: string } }) {
  const [title, setTitle] = useState('')
  const [artist, setArtist] = useState('')
  const [cover, setCover] = useState('')
  const [src, setSrc] = useState('')
  const [published, setPublished] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    fetch(`/api/admin/music/${params.id}`)
      .then(res => res.json())
      .then(data => {
        setTitle(data.title)
        setArtist(data.artist)
        setCover(data.cover)
        setSrc(data.src)
        setPublished(data.published)
      })
  }, [params.id])

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    const res = await fetch(`/api/admin/music/${params.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: params.id, title, artist, cover, src, published })
    })
    if (res.ok) {
      router.push('/admin/music')
    } else {
      setError('保存失败')
    }
  }

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-neutral-200">编辑音乐</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full p-2 rounded bg-[#181f2a] text-neutral-200 border border-[#2a3441]"
          placeholder="歌曲名称"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
        <input
          className="w-full p-2 rounded bg-[#181f2a] text-neutral-200 border border-[#2a3441]"
          placeholder="歌手"
          value={artist}
          onChange={e => setArtist(e.target.value)}
        />
        <input
          className="w-full p-2 rounded bg-[#181f2a] text-neutral-200 border border-[#2a3441]"
          placeholder="封面图片URL"
          value={cover}
          onChange={e => setCover(e.target.value)}
        />
        <input
          className="w-full p-2 rounded bg-[#181f2a] text-neutral-200 border border-[#2a3441]"
          placeholder="音频文件URL"
          value={src}
          onChange={e => setSrc(e.target.value)}
          required
        />
        <div className="flex gap-4 items-center">
          <span className="text-neutral-200">是否发布</span>
          <button
            type="button"
            aria-label="Toggle published status"
            onClick={() => setPublished(!published)}
            className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400 ${published ? 'bg-green-400' : 'bg-gray-400'}`}
            title={published ? '已发布，点击关闭' : '未发布，点击开启'}
          >
            <span
              aria-hidden="true"
              className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${published ? 'translate-x-5' : 'translate-x-0'}`}
            ></span>
          </button>
        </div>
        {error && <div className="text-red-400">{error}</div>}
        <div className="flex gap-4">
          <button type="submit" className="bg-red-400 hover:bg-red-400 text-neutral-200 rounded px-4 py-2 font-bold">保存</button>
          <button type="button" onClick={() => router.push('/admin/music')} className="bg-gray-400 hover:bg-gray-500 text-neutral-200 rounded px-4 py-2 font-bold">取消</button>
        </div>
      </form>
    </div>
  )
} 