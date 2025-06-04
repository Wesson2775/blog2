'use client'
import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from "next-auth/react"
import Image from 'next/image'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { data: session } = useSession()

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/admin/login' })
  }

  return (
    <div className="min-h-screen flex bg-[#181f2a]">
      {/* 移动端顶部栏 */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 flex items-center h-14 bg-[#232b3b] px-4 border-b border-border">
        <button className="mr-4 text-2xl text-neutral-200" onClick={() => setSidebarOpen(true)}>
          ≡
        </button>
        <span className="text-lg font-bold text-neutral-200">后台管理</span>
      </div>

      {/* 侧边栏 */}
      <aside className={`fixed md:static inset-y-0 left-0 w-56 bg-[#232b3b] text-neutral-200 transform md:transform-none transition-transform duration-200 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="flex flex-col h-full">
          {/* 移动端顶部栏 */}
          <div className="md:hidden flex items-center justify-between h-14 px-4 border-b border-border">
            <h2 className="text-lg font-bold">后台管理</h2>
            <button className="text-2xl text-neutral-200" onClick={() => setSidebarOpen(false)}>×</button>
          </div>

          {/* 侧边栏内容 */}
          <div className="flex-1 flex flex-col p-4 overflow-y-auto">
            <h2 className="text-xl font-bold mb-8 hidden md:block">后台管理</h2>

            <div className="flex-1 flex flex-col min-h-0">
              <nav className="flex flex-col gap-4">
                <Link href="/admin/dashboard" className="hover:text-red-400">仪表盘</Link>
                <Link href="/admin/posts" className="hover:text-red-400">文章管理</Link>
                <Link href="/admin/notes" className="hover:text-red-400">笔记管理</Link>
                <Link href="/admin/tags" className="hover:text-red-400">标签管理</Link>
                <Link href="/admin/links" className="hover:text-red-400">友链管理</Link>
                <Link href="/admin/music" className="hover:text-red-400">音乐管理</Link>
                <Link href="/admin/site" className="hover:text-red-400">站点配置</Link>
              </nav>

              {/* 用户信息和退出登录按钮 */}
              {session?.user && (
                <div className="mt-auto p-3 bg-[#1a2234] rounded-lg sticky bottom-0">
                  <div className="flex items-center gap-3 mb-3">
                    {session.user.image && (
                      <Image
                        src={session.user.image}
                        alt={session.user.name || '用户头像'}
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{session.user.name}</p>
                      <p className="text-xs text-gray-400 truncate">{session.user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="w-full py-1.5 px-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded text-sm transition-colors"
                  >
                    退出登录
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* 内容区 */}
      <main className="flex-1 p-4 md:p-8 overflow-auto" style={{marginTop: '56px'}}>
        {children}
      </main>
    </div>
  )
} 