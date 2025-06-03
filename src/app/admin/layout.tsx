'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (!localStorage.getItem('admin') && pathname !== '/admin/login') {
        router.replace('/admin/login')
      }
    }
  }, [router, pathname])

  return (
    <div className="min-h-screen flex bg-[#181f2a]">
      {/* 移动端顶部栏 */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center h-14 bg-[#232b3b] px-4 border-b border-border">
        <button className="mr-4 text-2xl text-neutral-200" onClick={() => setSidebarOpen(true)}>
          ≡
        </button>
        <span className="text-lg font-bold text-neutral-200">后台管理</span>
      </div>
      {/* 侧边栏菜单 */}
      <aside className={`fixed z-50 top-0 left-0 h-full w-56 bg-[#232b3b] text-neutral-200 flex flex-col py-8 px-4 transition-transform duration-200 md:static md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:flex md:py-8 md:px-4`} style={{minHeight:'100vh'}}>
        <h2 className="text-xl font-bold mb-8 hidden md:block">后台管理</h2>
        <button className="md:hidden absolute top-4 right-4 text-2xl text-neutral-200" onClick={() => setSidebarOpen(false)}>×</button>
        <nav className="flex flex-col gap-4 mt-10 md:mt-0">
          <Link href="/admin/dashboard" className="hover:text-red-400">仪表盘</Link>
          <Link href="/admin/posts" className="hover:text-red-400">文章管理</Link>
          <Link href="/admin/notes" className="hover:text-red-400">笔记管理</Link>
          <Link href="/admin/tags" className="hover:text-red-400">标签管理</Link>
          <Link href="/admin/links" className="hover:text-red-400">友链管理</Link>
          <Link href="/admin/music" className="hover:text-red-400">音乐管理</Link>
          <Link href="/admin/site" className="hover:text-red-400">站点配置</Link>
        </nav>
        <div className="mt-auto pt-8 text-xs text-gray-400 hidden md:block">© 2024 只抄</div>
      </aside>
      {/* 内容区 */}
      <main className="flex-1 p-4 md:p-8 overflow-auto md:ml-0" style={{marginTop: '56px'}}>
        {children}
      </main>
    </div>
  )
} 