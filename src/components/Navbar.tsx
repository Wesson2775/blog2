import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="fixed top-0 z-50 w-full bg-white/80 backdrop-blur-md dark:bg-gray-900/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-900 dark:text-white">
              我的博客
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/blog" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
              博客
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white">
              关于
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
} 