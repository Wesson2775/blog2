import Navbar from '@/components/Navbar'

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20">
        <div className="py-12">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            关于我
          </h1>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-lg text-gray-600 dark:text-gray-300">
              你好！我是一名热爱技术的开发者。这个博客是我分享技术见解、学习心得和生活感悟的地方。
            </p>
            <p className="text-lg text-gray-600 dark:text-gray-300 mt-4">
              我主要关注以下技术领域：
            </p>
            <ul className="list-disc list-inside mt-4 text-gray-600 dark:text-gray-300">
              <li>Web 开发</li>
              <li>人工智能</li>
              <li>云计算</li>
              <li>DevOps</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  )
} 