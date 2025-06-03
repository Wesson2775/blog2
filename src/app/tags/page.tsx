import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function TagsPage() {
  // 查询所有标签及其文章数量
  const tags = await prisma.tag.findMany({
    include: { _count: { select: { posts: true } } }
  })
  return (
    <div className="min-h-screen bg-[#181f2a]">
      <div className="mx-auto max-w-3xl px-4">
        <ul className="space-y-2">
          {tags.map((tag: { name: string; _count: { posts: number } }) => (
            <li key={tag.name} className="flex items-center text-lg">
              <span className="text-red-400">•</span>
              <span className="text-sm text-red-400 px-1 rounded cursor-pointer transition-colors border border-transparent hover:border-red-400 hover:text-red-500" style={{ background: 'none' }}>
                <Link href={`/tags/${encodeURIComponent(tag.name)}`}>{tag.name}</Link>
              </span>
              <span className="text-sm text-white">({tag._count.posts})</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
} 