import { prisma } from '@/lib/prisma'
import Link from 'next/link'

type TagWithCount = {
  id: string
  name: string
  published: boolean
  createdAt: Date
  post_count: string
}

export default async function TagsPage() {
  // 查询所有已发布的标签及其文章数量
  const tags = await prisma.$queryRaw<TagWithCount[]>`
    SELECT t.*, COUNT(pt."A") as post_count
    FROM "Tag" t
    LEFT JOIN "_PostToTag" pt ON t.id = pt."B"
    WHERE t.published = true
    GROUP BY t.id
    ORDER BY post_count DESC
  `
  return (
    <div className="bg-[#181f2a]">
      <div className="mx-auto max-w-3xl px-4 space-y-4">
        <div className="text-base text-neutral-200 mt-6 mb-2"> 标签 </div>
        <ul className="space-y-2">
          {tags.map((tag) => (
            <li key={tag.name} className="flex items-center text-lg">
              <span className="text-red-400">•</span>
              <span className="text-base text-red-400 px-1 rounded cursor-pointer transition-colors border border-transparent hover:border-red-400 hover:text-red-400" style={{ background: 'none' }}>
                <Link href={`/tags/${encodeURIComponent(tag.name)}`}>{tag.name}</Link>
              </span>
              <span className="text-base text-neutral-200">({Number(tag.post_count)})</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
} 