import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

// 获取所有笔记
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const search = searchParams.get('search') || ''

  const notes = await prisma.note.findMany({
    where: {
      OR: [
        { content: { contains: search } }
      ]
    },
    orderBy: { createdAt: 'desc' }
  })
  return NextResponse.json(notes)
}

// 新建笔记
export async function POST(req: Request) {
  const { content, pinned, published, createdAt, slug } = await req.json()
  const note = await prisma.note.create({
    data: {
      content,
      pinned,
      published,
      createdAt: createdAt ? new Date(createdAt) : new Date(),
      slug
    }
  })
  return NextResponse.json(note)
} 