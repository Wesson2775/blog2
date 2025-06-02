import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

// 获取笔记
export async function GET(req: Request, { params }: { params: { id: string } }) {
  const note = await prisma.note.findUnique({ where: { id: params.id } })
  return NextResponse.json(note)
}

// 更新笔记
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { content, pinned, published } = await req.json()
  const note = await prisma.note.update({
    where: { id: params.id },
    data: { content, pinned, published }
  })
  return NextResponse.json(note)
}

// 删除笔记
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  await prisma.note.delete({ where: { id: params.id } })
  return NextResponse.json({ success: true })
} 