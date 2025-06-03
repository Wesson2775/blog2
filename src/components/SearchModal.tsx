"use client"
import { useState, useEffect } from 'react'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

export default function SearchModal({ open, onClose, onSearch }: { open: boolean, onClose: () => void, onSearch: (q: string) => void }) {
  const [query, setQuery] = useState('')
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);
  if (!open) return null
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur"
      onClick={onClose}
    >
      <button className="absolute top-4 right-4 text-2xl text-neutral-200" onClick={onClose} aria-label="关闭">×</button>
      <form
        className="flex flex-col items-center w-full max-w-md px-4"
        onClick={e => e.stopPropagation()}
        onSubmit={e => { e.preventDefault(); onSearch(query) }}
      >
        <div className="flex items-center w-full" style={{ width: '80vw', maxWidth: 400 }}>
          <input
            autoFocus
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="搜索文章"
            className="flex-1 bg-transparent border-0 outline-none text-neutral-200 text-lg placeholder:text-gray-400 px-0 focus:ring-0 focus:outline-none"
            style={{ boxShadow: 'none', borderBottom: 'none' }}
          />
          <button type="submit" className="w-10 h-10 flex items-center justify-center rounded-full bg-red-400 hover:bg-red-400 transition-colors ml-2" title="搜索">
            <MagnifyingGlassIcon className="w-5 h-5 text-neutral-200" />
          </button>
        </div>
        <div className="h-0.5 w-[80vw] max-w-[400px] bg-white mt-0.5 mb-2 rounded-full" />
      </form>
    </div>
  )
} 