'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { EnvelopeIcon } from '@heroicons/react/24/solid'
import { useState, useRef, useEffect } from 'react'
import SearchModal from './SearchModal'

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="12" r="10" fill="#18181b" />
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C5.27.65 4.09 1 4.09 1A5.07 5.07 0 0 0 4 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 21.13V25" stroke="#fff" />
  </svg>
)

const menu = [
  { name: '首页', path: '/' },
  { name: '笔记', path: '/blog' },
  { name: '友链', path: '/links' },
  { name: '标签', path: '/tags' },
  { name: '关于', path: '/about' },
]

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [searchOpen, setSearchOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const menuBtnRef = useRef<HTMLButtonElement>(null)

  // 全局快捷键监听
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const handleSearch = (q: string) => {
    setSearchOpen(false)
    if (q.trim()) {
      router.push(`/search?q=${encodeURIComponent(q)}`)
    }
  }

  // 关闭三点菜单
  const handleMenuBlur = (e: React.FocusEvent<HTMLButtonElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setMenuOpen(false)
    }
  }

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b border-border bg-[#181f2a] backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* 左侧 Logo+博客名+搜索框（1280px以上和768-1280px都显示） */}
            <div className="flex items-center">
              <span className="text-2xl">🐧</span>
              <Link href="/" className="text-xl font-bold text-white ml-1">只抄</Link>
              {/* 搜索框，严格还原截图样式 */}
              <form
                action="/search"
                method="get"
                className="hidden md:flex items-center bg-[#232b3b] rounded-[8px] h-8 ml-[24px] min-w-0 px-3"
                style={{ width: 220 }}
                onClick={e => { e.preventDefault(); setSearchOpen(true); }}
              >
                <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 mr-2" />
                <input
                  type="text"
                  name="q"
                  placeholder="搜索文档"
                  className="flex-1 bg-transparent border-0 outline-none text-white text-sm placeholder:text-gray-400 px-0 h-8"
                  style={{ minWidth: 0 }}
                  readOnly
                />
                <span className="ml-2 px-2 py-0.5 bg-[#2d3340] text-xs text-gray-300 rounded-[6px] font-mono select-none" style={{lineHeight:'18px',height:'20px',display:'flex',alignItems:'center'}}>Ctrl K</span>
              </form>
            </div>
            {/* 右侧内容 */}
            <div className="flex items-center">
              {/* 桌面端菜单，md及以上显示，768-1280px和1280px以上都显示 */}
              <div className="hidden md:flex items-center space-x-2">
                {menu.map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                      pathname === item.path
                        ? 'text-red-400 font-semibold'
                        : 'text-neutral-200 hover:text-white'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              {/* 1280px以上显示 GitHub/邮箱图标 */}
              <div className="hidden xl:flex items-center space-x-2 ml-4">
                <a
                  href="https://github.com/yourusername"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-muted hover:bg-border transition-colors"
                  aria-label="GitHub"
                >
                  <GithubIcon className="w-5 h-5 text-white" />
                </a>
                <a
                  href="mailto:your.email@example.com"
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-muted hover:bg-border transition-colors"
                  aria-label="Email"
                >
                  <EnvelopeIcon className="w-5 h-5 text-white" />
                </a>
              </div>
              {/* 768-1280px 显示三点按钮，右侧，弹出下拉栏，栏内图标水平排列，悬浮弹出 */}
              <div className="hidden md:flex xl:hidden items-center ml-4 relative"
                onMouseEnter={() => setMenuOpen(true)}
                onMouseLeave={() => setMenuOpen(false)}
              >
                <button
                  ref={menuBtnRef}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#232b3b] transition-colors"
                  tabIndex={0}
                  aria-label="更多"
                  type="button"
                >
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/></svg>
                </button>
                {menuOpen && (
                  <div className="absolute right-0 top-8 w-24 rounded-[8px] bg-[#232b3b] shadow-lg border border-border flex flex-row items-center justify-center py-1 z-50 gap-2"
                    style={{ minWidth: 80 }}
                  >
                    <a
                      href="https://github.com/yourusername"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-border transition-colors"
                      aria-label="GitHub"
                    >
                      <GithubIcon className="w-5 h-5 text-white" />
                    </a>
                    <a
                      href="mailto:your.email@example.com"
                      className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-border transition-colors"
                      aria-label="Email"
                    >
                      <EnvelopeIcon className="w-5 h-5 text-white" />
                    </a>
                  </div>
                )}
              </div>
              {/* 768px以下，显示搜索图标和三横杠，二者并排，修复三横杠弹窗为全屏遮罩+顶部菜单 */}
              <div className="flex md:hidden items-center ml-2">
                <button className="p-2" title="搜索" onClick={() => setSearchOpen(true)}>
                  <MagnifyingGlassIcon className="w-5 h-5 text-white" />
                </button>
                <button className="p-2" title="菜单" onClick={() => setMobileMenuOpen(true)}>
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
                </button>
                {/* 移动端菜单弹窗：全屏遮罩，顶部为菜单和图标 */}
                {mobileMenuOpen && (
                  <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur flex flex-col h-screen" onClick={() => setMobileMenuOpen(false)}>
                    {/* 顶部菜单栏 */}
                    <div className="w-full bg-[#232b3b] pt-6 pb-8 px-6 rounded-b-[16px] flex flex-col items-center shadow-lg relative" onClick={e => e.stopPropagation()}>
                      <button className="absolute top-4 right-4 text-2xl text-white" onClick={() => setMobileMenuOpen(false)} aria-label="关闭">×</button>
                      <div className="flex flex-col items-center gap-6 mt-2">
                        {menu.map((item) => (
                          <Link
                            key={item.path}
                            href={item.path}
                            className="text-lg text-white font-medium hover:text-red-400 transition-colors"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {item.name}
                          </Link>
                        ))}
                        <div className="flex gap-6 mt-2">
                          <a
                            href="https://github.com/yourusername"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-border transition-colors"
                            aria-label="GitHub"
                          >
                            <GithubIcon className="w-6 h-6 text-white" />
                          </a>
                          <a
                            href="mailto:your.email@example.com"
                            className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-border transition-colors"
                            aria-label="Email"
                          >
                            <EnvelopeIcon className="w-6 h-6 text-white" />
                          </a>
                        </div>
                      </div>
                    </div>
                    {/* 其余区域为遮罩，点击关闭 */}
                    <div className="flex-1" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} onSearch={handleSearch} />
    </>
  )
} 