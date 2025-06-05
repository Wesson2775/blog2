'use client'
import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from "next-auth/react"
import Image from 'next/image'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const sidebarRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const { data: session } = useSession()

  // 如果是登录页面，直接返回子组件
  if (pathname === '/admin/login') {
    return children
  }

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/admin/login' })
  }

  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev)
  }

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setSidebarOpen(false)
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }

    if (sidebarOpen || dropdownOpen) {
      document.addEventListener('mousedown', handleOutsideClick)
    } else {
      document.removeEventListener('mousedown', handleOutsideClick)
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
  }, [sidebarOpen, dropdownOpen])

  return (
    <div className="min-h-screen flex flex-col bg-[#181f2a]">
      {/* 顶部导航栏 */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-[#232b3b] border-b border-border">
        <div className="flex items-center justify-between h-14 px-4">
          {/* 移动端菜单按钮 */}
          <button className="md:hidden text-2xl text-neutral-200" onClick={toggleSidebar}>
            ≡
          </button>

          {/* 桌面端导航菜单 */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              href="/admin/dashboard" 
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                pathname === '/admin/dashboard'
                  ? 'bg-red-400 text-white'
                  : 'text-neutral-200 hover:text-red-400'
              }`}
            >
              仪表盘
            </Link>
            <Link 
              href="/admin/posts" 
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                pathname === '/admin/posts'
                  ? 'bg-red-400 text-white'
                  : 'text-neutral-200 hover:text-red-400'
              }`}
            >
              文章管理
            </Link>
            <Link 
              href="/admin/notes" 
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                pathname === '/admin/notes'
                  ? 'bg-red-400 text-white'
                  : 'text-neutral-200 hover:text-red-400'
              }`}
            >
              笔记管理
            </Link>
            <Link 
              href="/admin/tags" 
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                pathname === '/admin/tags'
                  ? 'bg-red-400 text-white'
                  : 'text-neutral-200 hover:text-red-400'
              }`}
            >
              标签管理
            </Link>
            <Link 
              href="/admin/links" 
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                pathname === '/admin/links'
                  ? 'bg-red-400 text-white'
                  : 'text-neutral-200 hover:text-red-400'
              }`}
            >
              友链管理
            </Link>
            <Link 
              href="/admin/music" 
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                pathname === '/admin/music'
                  ? 'bg-red-400 text-white'
                  : 'text-neutral-200 hover:text-red-400'
              }`}
            >
              音乐管理
            </Link>
            <Link 
              href="/admin/site" 
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                pathname === '/admin/site'
                  ? 'bg-red-400 text-white'
                  : 'text-neutral-200 hover:text-red-400'
              }`}
            >
              站点配置
            </Link>
          </nav>

          {/* 用户头像和下拉菜单 */}
          {session?.user && (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center focus:outline-none"
              >
                {session.user.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || '用户头像'}
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-red-400 flex items-center justify-center text-white">
                    {session.user.name?.[0]?.toUpperCase()}
                  </div>
                )}
              </button>

              {/* 桌面端下拉菜单 */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-lg bg-[#232b3b] shadow-lg border border-border py-2">
                  <div className="px-4 py-2 border-b border-border">
                    <p className="text-sm font-medium text-neutral-200">{session.user.name}</p>
                    <p className="text-xs text-gray-400 truncate">{session.user.email}</p>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-[#1a2234]"
                  >
                    退出登录
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* 移动端侧边栏 */}
      <aside
        ref={sidebarRef}
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#1e293b]/80 backdrop-blur-sm text-neutral-200 transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:hidden`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-14 px-4 border-b border-border">
            <h2 className="text-lg font-bold">后台管理</h2>
            <button className="text-2xl text-neutral-200" onClick={toggleSidebar}>×</button>
          </div>

          <div className="flex-1 flex flex-col p-4 overflow-y-auto">
            <nav className="flex flex-col gap-4">
              <Link 
                href="/admin/dashboard" 
                className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                  pathname === '/admin/dashboard'
                    ? 'bg-red-400 text-white'
                    : 'hover:text-red-400'
                }`}
              >
                仪表盘
              </Link>
              <Link 
                href="/admin/posts" 
                className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                  pathname === '/admin/posts'
                    ? 'bg-red-400 text-white'
                    : 'hover:text-red-400'
                }`}
              >
                文章管理
              </Link>
              <Link 
                href="/admin/notes" 
                className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                  pathname === '/admin/notes'
                    ? 'bg-red-400 text-white'
                    : 'hover:text-red-400'
                }`}
              >
                笔记管理
              </Link>
              <Link 
                href="/admin/tags" 
                className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                  pathname === '/admin/tags'
                    ? 'bg-red-400 text-white'
                    : 'hover:text-red-400'
                }`}
              >
                标签管理
              </Link>
              <Link 
                href="/admin/links" 
                className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                  pathname === '/admin/links'
                    ? 'bg-red-400 text-white'
                    : 'hover:text-red-400'
                }`}
              >
                友链管理
              </Link>
              <Link 
                href="/admin/music" 
                className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                  pathname === '/admin/music'
                    ? 'bg-red-400 text-white'
                    : 'hover:text-red-400'
                }`}
              >
                音乐管理
              </Link>
              <Link 
                href="/admin/site" 
                className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                  pathname === '/admin/site'
                    ? 'bg-red-400 text-white'
                    : 'hover:text-red-400'
                }`}
              >
                站点配置
              </Link>
            </nav>
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