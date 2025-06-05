import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'

export default async function NotesPage({ searchParams }: { searchParams: { page?: string } }) {
  const page = parseInt(searchParams.page || '1', 10)
  const pageSize = 5
  const [notes, total] = await Promise.all([
    prisma.note.findMany({
      where: { published: true },
      orderBy: [
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
      <div className="space-y-4">
      <div className="text-base text-neutral-200 mt-6 mb-2"> 笔记 </div>
        {notes.length === 0 && <div className="text-neutral-400">没有找到笔记。</div>}
        {notes.map((note) => (
          <article key={note.id} className="group">
            <div className="mb-1 text-xs text-red-400">
              <time dateTime={note.createdAt.toISOString()}>
                {format(note.createdAt, 'yyyy/MM/dd', { locale: zhCN })}
              </time>
            </div>
            <div className="text-base text-neutral-200">{note.content}</div>
          </article>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center my-12">
          <div className="flex gap-2">
            {/* Page numbers */}
            {Array.from({ length: totalPages }).map((_, i) => {
              const pageNumber = i + 1;
              // Only show a limited number of pages around the current page, plus the first and last
              if (pageNumber === 1 || pageNumber === totalPages || (pageNumber >= page - 2 && pageNumber <= page + 2)) {
                return (
                  <Link
                    key={i}
                    href={`/notes?page=${pageNumber}`}
                    className={`flex items-center justify-center min-w-[24px] h-6 px-1 rounded border transition-colors ${
                      page === pageNumber
                        ? 'bg-red-400 text-neutral-200 border-transparent'
                        : 'border-transparent text-neutral-400 hover:text-red-400 hover:border-red-400'
                    }`}
                  >
                    {pageNumber}
                  </Link>
                );
              } else if (pageNumber === page - 3 || pageNumber === page + 3) {
                // Add ellipsis
                return <span key={i} className="text-neutral-400">...</span>;
              }
              return null;
            })}
          </div>

          {/* Next button */}
          {page < totalPages && (
            <Link
              href={`/notes?page=${page + 1}`}
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