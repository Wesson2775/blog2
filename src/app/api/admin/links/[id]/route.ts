import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  await prisma.link.delete({ where: { id: params.id } })
  return NextResponse.json({ ok: true })
}

// 获取单个友情链接
export async function GET(req: Request, { params }: { params: { id: string } }) {
  const link = await prisma.link.findUnique({ where: { id: params.id } })
  return NextResponse.json(link)
} 