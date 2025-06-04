import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { Post, Tag } from '@prisma/client'
import MarkdownViewer from '@/components/MarkdownViewer'

type PostWithTags = Post & {
  tags: Tag[]
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  // 首先检查文章是否存在
  const post = await prisma.post.findUnique({
    where: {
      slug: decodeURIComponent(params.slug)
    },
    include: {
      tags: true
    }
  })

  // 如果文章不存在，返回404
  if (!post) {
    console.error(`文章不存在: ${params.slug}`)
    notFound()
  }

  // 如果文章未发布，返回404
  if (!post.published) {
    console.error(`文章未发布: ${params.slug}`)
    notFound()
  }

  // 过滤出已发布的标签
  const publishedTags = post.tags.filter(tag => tag.published)
  
  // 如果文章没有任何已发布的标签，记录警告但继续显示文章
  if (publishedTags.length === 0) {
    console.warn(`文章没有已发布的标签: ${params.slug}`)
  }

  // 查询上一篇和下一篇
  const [prevPost, nextPost] = await Promise.all([
    prisma.post.findFirst({
      where: {
        published: true,
        createdAt: { gt: post.createdAt }
      },
      orderBy: { createdAt: 'asc' }
    }),
    prisma.post.findFirst({
      where: {
        published: true,
        createdAt: { lt: post.createdAt }
      },
      orderBy: { createdAt: 'desc' }
    })
  ])

  return (
    <div className="mx-auto max-w-3xl px-4">
      <article className="prose dark:prose-invert max-w-none">
        <h1 className="text-center">{post.title}</h1>
        <div className="mb-6 flex justify-center items-center text-sm text-neutral-400 gap-2">
          <time dateTime={post.createdAt.toISOString()}>
            {format(post.createdAt, 'yyyy/MM/dd', { locale: zhCN })}
          </time>
          {publishedTags.length > 0 && (
            <>
              <span className="mx-2">/</span>
              <span>
                {publishedTags.map((tag, index) => (
                  <span key={tag.id}>
                    {tag.name}
                    {index < publishedTags.length - 1 && <span className="mx-1">/</span>}
                  </span>
                ))}
              </span>
            </>
          )}
        </div>
        <MarkdownViewer content={post.content} />
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