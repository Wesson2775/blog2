import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { Post, Tag } from '@prisma/client'

type PostWithTags = Post & {
  tags: Tag[]
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await prisma.post.findUnique({
    where: {
      slug: params.slug,
      published: true
    },
    include: {
      tags: {
        where: {
          published: true
        }
      }
    }
  }) as PostWithTags | null

  if (!post) {
    notFound()
  }

  // 查询上一篇和下一篇
  const [prevPost, nextPost] = await Promise.all([
    prisma.post.findFirst({
      where: {
        published: true,
        createdAt: { lt: post.createdAt }
      },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.post.findFirst({
      where: {
        published: true,
        createdAt: { gt: post.createdAt }
      },
      orderBy: { createdAt: 'asc' }
    })
  ])

  return (
    <div className="mx-auto max-w-3xl px-4">
      <article className="prose dark:prose-invert max-w-none">
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
        <h1>{post.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </article>

      <div className="flex justify-between items-center mt-12 pt-4 border-t border-neutral-800">
        {prevPost ? (
          <Link
            href={`/blog/${prevPost.slug}`}
            className="flex items-center text-sm border rounded px-2 h-6 text-neutral-400 border-neutral-600 hover:text-red-400 hover:border-red-400 transition-colors"
          >
            <span className="mr-1">‹</span> 上一篇
          </Link>
        ) : (
          <div></div>
        )}
        {nextPost ? (
          <Link
            href={`/blog/${nextPost.slug}`}
            className="flex items-center text-sm border rounded px-2 h-6 text-neutral-400 border-neutral-600 hover:text-red-400 hover:border-red-400 transition-colors"
          >
            下一篇 <span className="ml-1">›</span>
          </Link>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  )
} 