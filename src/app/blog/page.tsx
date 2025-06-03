import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { Post } from '@prisma/client'

export default async function BlogPage({ searchParams }: { searchParams: { page?: string } }) {
  const page = parseInt(searchParams.page || '1', 10)
  const pageSize = 5
  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where: { published: true },
      include: { tags: true },
      orderBy: [
        { createdAt: 'desc' },
      ],
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.post.count({ where: { published: true } }),
  ])
  const totalPages = Math.ceil(total / pageSize)

  return (
    <div className="min-h-screen bg-[#181f2a]">
      <div className="mx-auto max-w-3xl px-4 space-y-10">
        {posts.map((post) => (
          <div key={post.id} className="">
            <div className="text-xs text-red-400 mb-1">{format(post.createdAt, 'yyyy/MM/dd', { locale: zhCN })}</div>
            <div className="text-sm text-neutral-300 line-clamp-2">
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
                href={`/blog?page=${i + 1}`}
                className={`w-8 h-8 rounded border ${page === i + 1 ? 'border-red-400 bg-red-400 text-neutral-200 font-bold' : 'border-transparent text-red-400 hover:border-red-400 hover:text-red-400'} flex items-center justify-center transition-colors`}
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