import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'

export default async function NotesPage({ searchParams }: { searchParams: { page?: string } }) {
  const page = parseInt(searchParams.page || '1', 10)
  const pageSize = 10
  const [notes, total] = await Promise.all([
    prisma.note.findMany({
      where: { published: true },
      orderBy: [
        { pinned: 'desc' },
        { createdAt: 'desc' },
      ],
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.note.count({ where: { published: true } }),
  ])
  const totalPages = Math.ceil(total / pageSize)

  return (
    <div className="mx-auto max-w-3xl px-4">
      <div className="space-y-8">
        {notes.length === 0 && <div className="text-neutral-400">没有找到笔记。</div>}
        {notes.map((note) => (
          <article key={note.id} className="group">
            <div className="mb-2 text-sm text-red-400">
              <time dateTime={note.createdAt.toISOString()}>
                {format(note.createdAt, 'yyyy/MM/dd', { locale: zhCN })}
              </time>
              {note.pinned && (
                <span className="ml-5">[置顶]</span>
              )}
            </div>
            <div className="text-m text-neutral-200">{note.content}</div>
          </article>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-between items-center my-12">
          <div className="flex gap-2">
            {Array.from({ length: Math.min(4, totalPages) }).map((_, i) => (
              <Link
                key={i}
                href={`/notes?page=${i + 1}`}
                className={`flex items-center justify-center min-w-[24px] h-6 px-1 rounded border transition-colors ${
                  page === i + 1 
                    ? 'bg-red-500 text-white border-transparent' 
                    : 'border-transparent text-neutral-400 hover:text-red-500 hover:border-red-500'
                }`}
              >
                {i + 1}
              </Link>
            ))}
            {totalPages > 4 && (
              <>
                <span className="text-neutral-400">...</span>
                <Link
                  href={`/notes?page=${totalPages}`}
                  className="flex items-center justify-center min-w-[24px] h-6 px-1 border border-transparent text-neutral-400 hover:text-red-500 hover:border-red-500 rounded"
                >
                  {totalPages}
                </Link>
              </>
            )}
          </div>
          {page < totalPages && (
            <Link
              href={`/notes?page=${page + 1}`}
              className="flex items-center text-sm border rounded px-2 h-6 text-neutral-400 border-neutral-600 hover:text-red-500 hover:border-red-500 transition-colors"
            >
              下一个 <span className="ml-1">›</span>
            </Link>
          )}
        </div>
      )}
    </div>
  )
} 