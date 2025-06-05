'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Search, Github, Mail, Menu, MoreHorizontal } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import SearchModal from './SearchModal'
import Image from 'next/image'
import clsx from 'clsx'
import '@/styles/navbar.css'

const menu = [
  { name: '首页', path: '/' },
  { name: '笔记', path: '/notes' },
  { name: '标签', path: '/tags' },
  { name: '友链', path: '/links' },
  { name: '关于', path: '/about' },
]

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [searchOpen, setSearchOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const menuBtnRef = useRef<HTMLButtonElement>(null)
  const [siteConfig, setSiteConfig] = useState({
    title: '',
    subtitle: '',
    github: '',
    email: ''
  })
  const [hamburgerHover, setHamburgerHover] = useState(false)

  useEffect(() => {
    fetch('/api/admin/site')
      .then(res => res.json())
      .then(setSiteConfig)
      .catch(() => setSiteConfig({ title: '', subtitle: '', github: '', email: '' }))
  }, [])

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

  const handleMobileMenuClick = () => {
    if(isAnimating) return;
    
    if(mobileMenuOpen) {
      // 逆向动画
      setIsAnimating(true);
      const btn = menuBtnRef.current;
      if (btn) {
        btn.classList.remove('active');
      }
      
      setTimeout(() => {
        setMobileMenuOpen(false);
        setIsAnimating(false);
      }, 300);
    } else {
      // 正向动画
      setMobileMenuOpen(true);
      const btn = menuBtnRef.current;
      if (btn) {
        btn.classList.add('active');
      }
    }
  }

  return (
    <>
      <nav className="sticky top-0 z-[9999] w-full border-b border-border">
        <div className="max-w-full md:max-w-[832px] mx-auto px-2 sm:px-4 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* 左侧 Logo+博客名+搜索框（1280px以上和768-1280px都显示） */}
            <div className="flex items-center">
              <Image
                src="/512x512.png"
                alt="Avatar"
                width={32}
                height={32}
                className="rounded-full"
              />
              <Link href="/" className="text-xl font-bold text-neutral-200 ml-3">{siteConfig.title}</Link>
              {/* 搜索框，严格还原截图样式 */}
              <form
                action="/search"
                method="get"
                className="hidden md:flex items-center bg-[#232b3b] rounded-[8px] h-6 ml-[24px] min-w-0 px-2"
                style={{ width: 150 }}
                onClick={e => { e.preventDefault(); setSearchOpen(true); }}
              >
                <Search className="w-4 h-4 text-gray-400 mr-2" />
                <input
                  type="text"
                  name="q"
                  placeholder="搜索文档"
                  className="flex-1 bg-transparent border-0 outline-none text-neutral-200 text-xs placeholder:text-gray-400 px-0 h-8"
                  style={{ minWidth: 0 }}
                  readOnly
                />
                <span className="ml-3 px-1 py-0.5 bg-gray-800 text-xs text-gray-300 rounded-md font-mono select-none leading-snug h-3 flex items-center">Ctrl K</span>
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
                        : 'text-neutral-200 hover:text-neutral-200'
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              {/* 1280px以上显示 GitHub/邮箱图标 */}
              <div className="hidden xl:flex items-center space-x-2 ml-4">
                <a
                  href={siteConfig.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-muted hover:bg-border transition-colors"
                  aria-label="GitHub"
                >
                  <Github className="w-5 h-5 text-gray-400" />
                </a>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-muted hover:bg-border transition-colors"
                  aria-label="Email"
                >
                  <Mail className="w-5 h-5 text-gray-400" />
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
                  <MoreHorizontal className="w-6 h-6 text-neutral-200" />
                </button>
                {menuOpen && (
                  <div className="absolute right-0 top-8 w-24 rounded-[8px] bg-[#232b3b] shadow-lg border border-border flex flex-row items-center justify-center py-1 z-50 gap-2"
                    style={{ minWidth: 80 }}
                  >
                    <a
                      href={siteConfig.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-border transition-colors"
                      aria-label="GitHub"
                    >
                      <Github className="w-5 h-5 text-gray-400" />
                    </a>
                    <a
                      href={`mailto:${siteConfig.email}`}
                      className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-border transition-colors"
                      aria-label="Email"
                    >
                      <Mail className="w-5 h-5 text-gray-400" />
                    </a>
                  </div>
                )}
              </div>
              {/* 768px以下，显示搜索图标和三横杠，二者并排，修复三横杠弹窗为全屏遮罩+顶部菜单 */}
              <div className="flex md:hidden items-center ml-0 space-x-1 w-auto">
                <button className="p-2 flex items-center justify-center" style={{minWidth:36}} title="搜索" onClick={() => setSearchOpen(true)}>
                  <Search className="w-5 h-5 text-neutral-200" />
                </button>
                {/* 新汉堡菜单按钮 */}
                <button 
                  ref={menuBtnRef}
                  className={`hamburger-btn ${mobileMenuOpen ? 'active' : ''}`}
                  onClick={handleMobileMenuClick}
                  aria-label="菜单"
                >
                  <div className="hamburger-container">
                    <div className="hamburger-line top"></div>
                    <div className="hamburger-line middle"></div>
                    <div className="hamburger-line bottom"></div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} onSearch={handleSearch} />
      
      {/* 添加移动端侧边栏 */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-content">
          <div className="flex flex-col h-full w-full">
            <div className="flex flex-col space-y-4 mt-8">
              {menu.map((item) => (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`px-4 py-2 text-lg font-medium transition-colors ${
                    pathname === item.path
                      ? 'text-red-400 font-semibold'
                      : 'text-neutral-200 hover:text-neutral-200'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="icon-container">
                <a
                  href={siteConfig.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-[#232b3b] transition-colors"
                  aria-label="GitHub"
                >
                  <Github className="w-5 h-5 text-gray-400" />
                </a>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-[#232b3b] transition-colors"
                  aria-label="Email"
                >
                  <Mail className="w-5 h-5 text-gray-400" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
} 