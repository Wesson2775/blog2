import { notFound } from 'next/navigation'
import Navbar from '@/components/Navbar'
import { prisma } from '@/lib/prisma'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { Tag } from '@/types/post'
import MDXContent from '@/components/MDXContent'

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

  // 目录生成（简单示例，实际可用 remark-toc 或自定义）
  const toc = post.content.match(/^#+\s.+/gm)?.map((line: string, i: number) => {
    const level = line.match(/^#+/)[0].length
    const text = line.replace(/^#+\s/, '')
    return { level, text, id: `toc-${i}` }
  }) || []

  return (
    <>
      <Navbar />
      <div className="mx-auto max-w-2xl px-4 pt-12 pb-24 bg-white dark:bg-neutral-900">
        <h1 className="text-3xl font-bold text-center mb-2">{post.title}</h1>
        <div className="text-center text-sm text-muted-foreground mb-4">
          {format(post.createdAt, 'yyyy-MM-dd', { locale: zhCN })}
          {post.tags.length > 0 && (
            <>
              {' / '}
              {post.tags.map((tag: Tag) => (
                <span key={tag.id} className="inline-block mx-1 text-xs text-red-400">{tag.name}</span>
              ))}
            </>
          )}
        </div>
        <div className="flex gap-8">
          {/* 目录卡片 */}
          {toc.length > 0 && (
            <aside className="w-48 flex-shrink-0 hidden md:block">
              <div className="border border-border rounded bg-white/80 dark:bg-neutral-800 p-4 text-xs mb-6">
                <div className="font-bold text-red-500 mb-2">Contents</div>
                <ul className="space-y-1">
                  {toc.map((item, idx) => (
                    <li key={item.id} className="ml-2" style={{ marginLeft: (item.level - 1) * 12 }}>
                      <a href={`#${item.id}`} className="hover:underline text-foreground">{item.text}</a>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          )}
          {/* 正文内容 */}
          <article className="prose dark:prose-invert max-w-none flex-1">
            <MDXContent content={post.content} />
          </article>
        </div>
      </div>
    </>
  )
} 