import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

// 获取所有文章
export async function GET() {
  const posts = await prisma.post.findMany({
    include: { tags: true },
    orderBy: [{ createdAt: 'desc' }]
  })
  return NextResponse.json(posts)
}

// 新建文章
export async function POST(req: Request) {
  const { title, content, tags, pinned, published, createdAt, slug } = await req.json()
  const post = await prisma.post.create({
    data: {
      title,
      content,
      pinned,
      published,
      createdAt: createdAt ? new Date(createdAt) : new Date(),
      slug,
      tags: {
        connect: tags.map((id: string) => ({ id }))
      }
    },
    include: { tags: true }
  })
  return NextResponse.json(post)
}

 