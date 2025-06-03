import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

// 获取单篇文章
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const post = await prisma.post.findUnique({
    where: { id: params.id },
    include: { tags: true }
  })
  return NextResponse.json(post)
}

// 编辑文章
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json()
  const data: any = {}
  if (typeof body.title !== 'undefined') data.title = body.title
  if (typeof body.content !== 'undefined') data.content = body.content
  if (typeof body.pinned !== 'undefined') data.pinned = body.pinned
  if (typeof body.published !== 'undefined') data.published = body.published
  if (Array.isArray(body.tags)) {
    data.tags = { set: body.tags.map((id: string) => ({ id })) }
  }
  const post = await prisma.post.update({
    where: { id: params.id },
    data,
    include: { tags: true }
  })
  return NextResponse.json(post)
}

// 删除文章
export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  await prisma.post.delete({ where: { id: params.id } })
  return NextResponse.json({ ok: true })
} 