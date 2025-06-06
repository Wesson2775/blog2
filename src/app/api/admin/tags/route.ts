import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

// 获取所有标签
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const search = searchParams.get('search') || ''

  const tags = await prisma.tag.findMany({
    where: {
      name: {
        contains: search
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  })
  return NextResponse.json(tags)
}

// 新建标签
export async function POST(req: Request) {
  const { name, published } = await req.json()
  const tag = await prisma.tag.create({
    data: { name, published }
  })
  return NextResponse.json(tag)
}

// 更新标签
export async function PUT(req: Request) {
  const { id, published } = await req.json()
  const tag = await prisma.tag.update({
    where: { id },
    data: { published }
  })
  return NextResponse.json(tag)
}

// 删除标签
export async function DELETE(req: Request) {
  const { id } = await req.json()
  await prisma.tag.delete({ where: { id } })
  return NextResponse.json({ success: true })
} 