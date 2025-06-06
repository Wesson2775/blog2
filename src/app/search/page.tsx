import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { Post } from '@prisma/client'
import { Prisma } from '@prisma/client'
import { SearchIcon } from 'lucide-react';
// import BackButton from '@/components/BackButton'

export default async function SearchPage({ searchParams }: { searchParams: { q?: string, page?: string } }) {
  const q = searchParams.q?.trim() || ''
  const page = parseInt(searchParams.page || '1', 10)
  const pageSize = 5
  const where: Prisma.PostWhereInput = q
    ? {
        published: true,
        OR: [
          { title: { contains: q } },
          { content: { contains: q } },
        ],
      }
    : { published: true }
  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where,
      include: { tags: true },
      orderBy: [{ createdAt: 'desc' }],
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.post.count({ where }),
  ])
  const totalPages = Math.ceil(total / pageSize)

  return (
    <div className="mx-auto max-w-3xl px-4">
      <h1 className="text-base mb-8">搜索：{q}</h1>
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
                    <span key={tag.id} className="text-red-400">
                      {tag.name}
                      {index < post.tags.length - 1 && ' '}
                    </span>
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
                href={`/search?q=${encodeURIComponent(q)}&page=${i + 1}`}
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
                  href={`/search?q=${encodeURIComponent(q)}&page=${totalPages}`}
                  className="flex items-center justify-center min-w-[24px] h-6 px-1 border border-transparent text-neutral-400 hover:text-red-400 hover:border-red-400 rounded"
                >
                  {totalPages}
                </Link>
              </>
            )}
          </div>
          {page < totalPages && (
            <Link
              href={`/search?q=${encodeURIComponent(q)}&page=${page + 1}`}
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