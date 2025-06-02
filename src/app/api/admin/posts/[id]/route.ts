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
  const { title, content, tags, pinned, published } = await req.json()
  const post = await prisma.post.update({
    where: { id: params.id },
    data: {
      title,
      content,
      pinned,
      published,
      tags: {
        set: tags.map((id: string) => ({ id }))
      }
    },
    include: { tags: true }
  })
  return NextResponse.json(post)
}

// 删除文章
export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  await prisma.post.delete({ where: { id: params.id } })
  return NextResponse.json({ ok: true })
} 