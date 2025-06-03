import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

// 获取所有友情链接
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const search = searchParams.get('search') || ''

  const links = await prisma.link.findMany({
    where: {
      OR: [
        { name: { contains: search } },
        { description: { contains: search } }
      ]
    },
    orderBy: { createdAt: 'desc' }
  })
  return NextResponse.json(links)
}

// 新建友情链接
export async function POST(req: Request) {
  const { name, url, description } = await req.json()
  const link = await prisma.link.create({
    data: { name, url, description }
  })
  return NextResponse.json(link)
}

// 更新友情链接
export async function PUT(req: Request) {
  const { id, name, url, description, published } = await req.json()
  const link = await prisma.link.update({
    where: { id },
    data: { name, url, description, published }
  })
  return NextResponse.json(link)
}

// 删除友情链接
export async function DELETE(req: Request) {
  const { id } = await req.json()
  await prisma.link.delete({ where: { id } })
  return NextResponse.json({ success: true })
} 