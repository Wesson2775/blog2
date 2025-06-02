'use client'

import { Inter } from 'next/font/google'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import MusicPlayer from './MusicPlayer'

const inter = Inter({ subsets: ['latin'] })

interface LayoutProps {
  children: React.ReactNode
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh">
      <body className={inter.className}>
        <Navbar />
        <div className="flex gap-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <main className="flex-1 pt-12 pb-24">
            {children}
          </main>
          <div className="hidden lg:block">
            <Sidebar />
          </div>
        </div>
        <footer className="text-center py-8 text-gray-400 text-sm">
          <p>© 2024 只抄. All rights reserved.</p>
          <div className="mt-2 space-x-4">
            <a href="/analytics" className="hover:text-white">Analytics</a>
            <a href="/rss" className="hover:text-white">RSS</a>
          </div>
        </footer>
        <MusicPlayer />
      </body>
    </html>
  )
} 