import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { Tag } from '@/types/post'
import MDXContent from '@/components/MDXContent'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface PostPageProps {
  params: {
    slug: string
  }
}

export default async function PostPage({ params }: PostPageProps) {
  const decodedSlug = decodeURIComponent(params.slug)
  const post = await prisma.post.findUnique({
    where: {
      slug: decodedSlug,
      published: true,
    },
    include: {
      tags: true,
    },
  })

  if (!post) {
    notFound()
  }

  // 查询上一篇和下一篇
  const prevPost = await prisma.post.findFirst({
    where: {
      published: true,
      createdAt: { lt: post.createdAt },
    },
    orderBy: { createdAt: 'desc' },
    select: { slug: true, title: true },
  })
  const nextPost = await prisma.post.findFirst({
    where: {
      published: true,
      createdAt: { gt: post.createdAt },
    },
    orderBy: { createdAt: 'asc' },
    select: { slug: true, title: true },
  })

  return (
    <div className="mx-auto max-w-3xl px-4">
      <article>
        <header className="text-center mb-12">
          <h1 className="text-3xl font-normal mb-4">{post.title}</h1>
          <div className="flex items-center justify-center gap-2 text-sm text-neutral-400">
            <time dateTime={post.createdAt.toISOString()}>
              {format(post.createdAt, 'yyyy/MM/dd', { locale: zhCN })}
            </time>
            {post.tags.length > 0 && (
              <>
                <span>/</span>
                {post.tags.map((tag: Tag, index: number) => (
                  <span key={tag.id}>
                    {tag.name}
                    {index < post.tags.length - 1 && ', '}
                  </span>
                ))}
              </>
            )}
          </div>
        </header>
        
        <div className="prose prose-neutral dark:prose-invert max-w-none">
          <MDXContent content={post.content} />
        </div>
      </article>
      <div className="mt-16 flex justify-between items-center text-sm">
        {prevPost ? (
          <Link href={`/blog/${prevPost.slug}`} className="text-neutral-400 hover:text-red-400 transition-colors max-w-[45%] truncate text-left">
            ← 上一篇：{prevPost.title}
          </Link>
        ) : <div />}
        {nextPost ? (
          <Link href={`/blog/${nextPost.slug}`} className="text-neutral-400 hover:text-red-400 transition-colors max-w-[45%] truncate text-right ml-auto">
            下一篇：{nextPost.title} →
          </Link>
        ) : <div />}
      </div>
    </div>
  )
} 