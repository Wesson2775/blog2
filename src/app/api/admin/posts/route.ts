import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

// 获取所有文章
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const search = searchParams.get('search') || ''
  const posts = await prisma.post.findMany({
    where: {
      OR: [
        { title: { contains: search } },
        { content: { contains: search } }
      ]
    },
    include: { tags: true },
    orderBy: [{ createdAt: 'desc' }]
  })
  return NextResponse.json(posts)
}

// 新建文章
export async function POST(req: Request) {
  const { title, content, tags, published, createdAt, slug } = await req.json()
  const post = await prisma.post.create({
    data: {
      title,
      content,
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

 