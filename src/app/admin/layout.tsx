'use client'
import Link from 'next/link'
import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (!localStorage.getItem('admin') && pathname !== '/admin/login') {
        router.replace('/admin/login')
      }
    }
  }, [router, pathname])

  return (
    <div className="min-h-screen flex bg-[#181f2a]">
      {/* 侧边栏菜单 */}
      <aside className="w-56 bg-[#232b3b] text-neutral-200 flex flex-col py-8 px-4">
        <h2 className="text-xl font-bold mb-8">后台管理</h2>
        <nav className="flex flex-col gap-4">
          <Link href="/admin/dashboard" className="hover:text-red-400">仪表盘</Link>
          <Link href="/admin/posts" className="hover:text-red-400">文章管理</Link>
          <Link href="/admin/notes" className="hover:text-red-400">笔记管理</Link>
          <Link href="/admin/tags" className="hover:text-red-400">标签管理</Link>
          <Link href="/admin/links" className="hover:text-red-400">友链管理</Link>
          <Link href="/admin/music" className="hover:text-red-400">音乐管理</Link>
          <Link href="/admin/site" className="hover:text-red-400">站点配置</Link>
        </nav>
        <div className="mt-auto pt-8 text-xs text-gray-400">© 2024 只抄</div>
      </aside>
      {/* 内容区 */}
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  )
} 