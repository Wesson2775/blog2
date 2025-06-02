import Link from 'next/link'
import { Post } from '@/types/post'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'

interface PostListProps {
  posts: Post[]
}

export default function PostList({ posts }: PostListProps) {
  return (
    <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <article
          key={post.id}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
        >
          {post.coverImage && (
            <div className="relative h-48">
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="p-6">
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
              <time dateTime={post.createdAt.toISOString()}>
                {format(post.createdAt, 'PPP', { locale: zhCN })}
              </time>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              {post.title}
            </h2>
            {post.excerpt && (
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {post.excerpt}
              </p>
            )}
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="px-2 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded"
                >
                  {tag.name}
                </span>
              ))}
            </div>
            <Link
              href={`/blog/${post.slug}`}
              className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              阅读更多 →
            </Link>
          </div>
        </article>
      ))}
    </div>
  )
} 