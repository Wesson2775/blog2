"use client"
export default function BackButton() {
  return (
    <button onClick={() => window.history.back()} className="inline-flex items-center text-sm text-neutral-400 hover:text-red-400 transition-colors mt-4">← 返回</button>
  )
} 