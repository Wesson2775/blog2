import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { Post, Tag } from '@/types/post'

export default async function Home({ searchParams }: { searchParams: { page?: string } }) {
  const page = parseInt(searchParams.page || '1', 10)
  const pageSize = 5
  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where: { published: true },
      include: { tags: true },
      orderBy: [
        { pinned: 'desc' },
        { createdAt: 'desc' },
      ],
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.post.count({ where: { published: true } }),
  ])
  const totalPages = Math.ceil(total / pageSize)

  return (
    <div className="mx-auto max-w-3xl px-4 pt-12 pb-24 bg-[#181f2a]">
      <div className="space-y-8">
        {posts.map((post: Post) => (
          <div key={post.id}>
            {/* 日期和tag同一行 */}
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs text-red-400 font-semibold">
                {format(post.createdAt, 'yyyy/MM/dd', { locale: zhCN })}
              </span>
              {Boolean((post as any).pinned) && (
                <span className="text-xs text-red-500 font-bold border border-red-200 rounded px-1">[置顶]</span>
              )}
              {post.tags.map((tag: Tag) => (
                <Link
                  key={tag.id}
                  href={`/tags/${encodeURIComponent(tag.name)}`}
                  className="text-xs text-red-400 px-1 rounded cursor-pointer transition-colors border border-transparent hover:border-red-400 hover:text-red-500"
                  style={{ background: 'none' }}
                >
                  {tag.name}
                </Link>
              ))}
            </div>
            {/* 标题和摘要另起一行 */}
            <Link href={`/blog/${post.slug}`} className="block text-base font-bold text-white hover:text-primary mb-1">
              {post.title}
            </Link>
            <div className="text-xs text-neutral-300 line-clamp-2">
              {post.excerpt}
            </div>
          </div>
        ))}
      </div>
      {/* 分页器UI */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-12">
          <nav className="inline-flex items-center space-x-2 text-xs select-none">
            {Array.from({ length: totalPages }).map((_, i) => (
              <Link
                key={i}
                href={`/?page=${i + 1}`}
                className={`w-8 h-8 rounded border ${page === i + 1 ? 'border-red-500 bg-red-500 text-white font-bold' : 'border-transparent text-red-500 hover:border-red-500 hover:text-red-500'} flex items-center justify-center transition-colors`}
              >
                {i + 1}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </div>
  )
}
