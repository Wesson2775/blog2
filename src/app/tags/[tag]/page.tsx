import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { Post, Tag } from '@prisma/client'

type PostWithTags = Post & {
  tags: Tag[]
}

export default async function TagPostsPage({ params, searchParams }: { params: { tag: string }, searchParams: { page?: string } }) {
  const tag = decodeURIComponent(params.tag)
  const page = parseInt(searchParams.page || '1', 10)
  const pageSize = 5

  // 首先检查标签是否存在且已发布
  const tagExists = await prisma.tag.findFirst({
    where: {
      name: tag,
      published: true
    }
  })

  if (!tagExists) {
    return (
      <div className="mx-auto max-w-3xl px-4 flex flex-col items-center justify-center">
        <div className="text-neutral-400">标签不存在或未发布。</div>
      </div>
    )
  }

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where: { 
        published: true, 
        tags: { 
          some: { 
            name: tag,
            published: true
          } 
        } 
      },
      include: { 
        tags: {
          where: {
            published: true
          }
        } 
      },
      orderBy: [{ createdAt: 'desc' }],
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.post.count({ 
      where: { 
        published: true, 
        tags: { 
          some: { 
            name: tag,
            published: true
          } 
        } 
      } 
    }),
  ]) as [PostWithTags[], number]
  const totalPages = Math.ceil(total / pageSize)

  return (
    <div className="mx-auto max-w-3xl px-4">
      <h1 className="text-base mb-8">标签：{tag}</h1>
      <div className="space-y-12">
        {posts.length === 0 && <div className="text-neutral-400">没有找到相关文章。</div>}
        {posts.map((post) => (
          <article key={post.id} className="group">
            <div className="mb-2 text-sm text-neutral-400 flex gap-5">
              <time dateTime={post.createdAt.toISOString()}>
                {format(post.createdAt, 'yyyy/MM/dd', { locale: zhCN })}
              </time>
              {post.tags.length > 0 && (
                <div className="flex gap-1">
                  {post.tags.map((tag, index) => (
                    <Link href={`/tags/${encodeURIComponent(tag.name)}`} key={tag.id}>
                      <span className="text-red-400 hover:text-red-400">
                        {tag.name}
                        {index < post.tags.length - 1 && ' '}
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <Link href={`/blog/${encodeURIComponent(post.slug)}`}>
              <h2 className="text-base mb-2 hover:text-red-400 transition-colors">{post.title}</h2>
            </Link>
            <p className="text-neutral-400 text-sm line-clamp-2">{post.content}</p>
          </article>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-between items-center my-12">
          <div className="flex gap-2">
            {Array.from({ length: Math.min(4, totalPages) }).map((_, i) => (
              <Link
                key={i}
                href={`/tags/${encodeURIComponent(tag)}?page=${i + 1}`}
                className={`flex items-center justify-center min-w-[24px] h-6 px-1 rounded border transition-colors ${
                  page === i + 1 
                    ? 'bg-red-400 text-neutral-200 border-transparent' 
                    : 'border-transparent text-neutral-400 hover:text-red-400 hover:border-red-400'
                }`}
              >
                {i + 1}
              </Link>
            ))}
            {totalPages > 4 && (
              <>
                <span className="text-neutral-400">...</span>
                <Link
                  href={`/tags/${encodeURIComponent(tag)}?page=${totalPages}`}
                  className="flex items-center justify-center min-w-[24px] h-6 px-1 border border-transparent text-neutral-400 hover:text-red-400 hover:border-red-400 rounded"
                >
                  {totalPages}
                </Link>
              </>
            )}
          </div>
          {page < totalPages && (
            <Link
              href={`/tags/${encodeURIComponent(tag)}?page=${page + 1}`}
              className="flex items-center text-sm border rounded px-2 h-6 text-neutral-400 border-neutral-600 hover:text-red-400 hover:border-red-400 transition-colors"
            >
              下一个 <span className="ml-1">›</span>
            </Link>
          )}
        </div>
      )}
    </div>
  )
} 