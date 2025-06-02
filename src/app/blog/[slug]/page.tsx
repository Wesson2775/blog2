import { notFound } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { prisma } from '@/lib/prisma'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { Tag } from '@/types/post'

interface PostPageProps {
  params: {
    slug: string
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const post = await prisma.post.findUnique({
    where: {
      slug: params.slug,
      published: true,
    },
    include: {
      tags: true,
    },
  })

  if (!post) {
    notFound()
  }

  return (
    <>
      <Navbar />
      <article className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-20">
        <div className="py-12">
          {post.coverImage && (
            <div className="relative h-96 mb-8">
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          )}
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {post.title}
            </h1>
            <div className="flex items-center text-gray-500 dark:text-gray-400 mb-4">
              <time dateTime={post.createdAt.toISOString()}>
                {format(post.createdAt, 'PPP', { locale: zhCN })}
              </time>
            </div>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag: Tag) => (
                <span
                  key={tag.id}
                  className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          </header>
          <div className="prose dark:prose-invert max-w-none">
            {post.content}
          </div>
        </div>
      </article>
    </>
  )
} 