import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

// 获取单个友情链接
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const link = await prisma.link.findUnique({ where: { id: params.id } })
    if (!link) {
      return NextResponse.json({ error: 'Link not found' }, { status: 404 })
    }
    return NextResponse.json(link)
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching link' }, { status: 500 })
  }
}

// PUT /api/admin/links/:id
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { name, url, description, published } = await req.json()
    const updatedLink = await prisma.link.update({
      where: { id: params.id },
      data: { name, url, description, published },
    })
    return NextResponse.json(updatedLink)
  } catch (error) {
    return NextResponse.json({ error: 'Error updating link' }, { status: 500 })
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.link.delete({ where: { id: params.id } })
    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting link' }, { status: 500 })
  }
} 