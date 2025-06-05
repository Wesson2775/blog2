'use client'

import { Inter } from 'next/font/google'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

const Navbar = dynamic(() => import('./Navbar'), { ssr: true })
const Sidebar = dynamic(() => import('./Sidebar'), { ssr: false })

const inter = Inter({ subsets: ['latin'] })

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const [siteConfig, setSiteConfig] = useState({
    title: '',
    subtitle: ''
  })

  useEffect(() => {
    const fetchSiteConfig = async () => {
      try {
        const response = await fetch('/api/admin/site')
        const data = await response.json()
        setSiteConfig(data)
        // 更新网页标题
        document.title = data.title || ''
      } catch (error) {
        console.error('获取站点配置失败:', error)
      }
    }

    fetchSiteConfig()
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex gap-8 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <main className="flex-1">
          {children}
        </main>
        <div className="hidden md:block min-w-[140px] max-w-[260px] w-1/4">
          <Sidebar />
        </div>
      </div>
      <footer className="border-t border-border bg-[#181f2a]">
        <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-400 text-xs">
            <p>© {new Date().getFullYear()} {siteConfig.title || ''}. All rights reserved.</p>
            <div className="mt-2 space-x-4">
              <a href="/analytics" className="hover:text-neutral-200">Analytics</a>
              <a href="/rss.xml" className="hover:text-neutral-200">RSS</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
} 