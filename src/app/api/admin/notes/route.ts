import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

// 获取所有笔记
export async function GET() {
  const notes = await prisma.note.findMany({
    orderBy: [{ createdAt: 'desc' }]
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