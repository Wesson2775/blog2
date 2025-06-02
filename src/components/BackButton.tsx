"use client"
export default function BackButton() {
  return (
    <button onClick={() => window.history.back()} className="mb-6 mt-4 py-1.5 rounded bg-[#232b3b] text-red-400 hover:bg-[#232b3b]/80 font-medium text-sm transition-colors">← 返回</button>
  )
} 