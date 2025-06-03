'use client'

import { Inter } from 'next/font/google'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import MusicPlayer from './MusicPlayer'

const inter = Inter({ subsets: ['latin'] })

interface LayoutProps {
  children: React.ReactNode
}

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex gap-8 w-[832px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <main className="flex-1">
          {children}
        </main>
        <div className="hidden md:block w-[180px]">
          <Sidebar />
        </div>
      </div>
      <footer className="border-t border-border bg-[#181f2a]">
        <div className="w-[832px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-400 text-xs">
            <p>© 2024 只抄. All rights reserved.</p>
            <div className="mt-2 space-x-4">
              <a href="/analytics" className="hover:text-neutral-200">Analytics</a>
              <a href="/rss" className="hover:text-neutral-200">RSS</a>
            </div>
          </div>
        </div>
      </footer>
      <MusicPlayer />
    </div>
  )
} 