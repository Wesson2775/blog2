import Navbar from '@/components/Navbar'
import Link from 'next/link'

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20">
        <div className="py-12">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            博客文章
          </h1>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* 这里将来会显示博客文章列表 */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  示例文章标题
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  这是一篇示例文章的摘要...
                </p>
                <Link
                  href="/blog/example-post"
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  阅读更多 →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
} 