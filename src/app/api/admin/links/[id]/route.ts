import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 获取单个友情链接
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const link = await prisma.link.findUnique({
      where: { id: params.id }
    })

    if (!link) {
      return new NextResponse('Not Found', { status: 404 })
    }

    return NextResponse.json(link)
  } catch (error) {
    console.error('获取友链失败:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

// PUT /api/admin/links/:id
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { name, url, description } = body

    const link = await prisma.link.update({
      where: { id: params.id },
      data: { name, url, description }
    })

    return NextResponse.json(link)
  } catch (error) {
    console.error('更新友链失败:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.link.delete({
      where: { id: params.id }
    })

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('删除友链失败:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 