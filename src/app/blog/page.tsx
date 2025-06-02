import Navbar from '@/components/Navbar'
import PostList from '@/components/PostList'
import { prisma } from '@/lib/prisma'

export default async function BlogPage() {
  const posts = await prisma.post.findMany({
    where: {
      published: true,
    },
    include: {
      tags: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return (
    <>
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20">
        <div className="py-12">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            博客文章
          </h1>
          <PostList posts={posts} />
        </div>
      </div>
    </>
  )
} 