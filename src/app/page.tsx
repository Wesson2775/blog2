import Navbar from '@/components/Navbar'

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20">
        <div className="py-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
            欢迎来到我的博客
          </h1>
          <p className="mt-6 text-lg text-gray-600 dark:text-gray-300">
            这里记录着我的技术探索、学习心得和生活感悟。
          </p>
        </div>
      </div>
    </>
  )
}
