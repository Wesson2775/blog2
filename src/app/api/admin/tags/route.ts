import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

// 获取所有标签
export async function GET() {
  const tags = await prisma.tag.findMany({ orderBy: { name: 'asc' } })
  return NextResponse.json(tags)
}

// 新建标签
export async function POST(req: Request) {
  const { name } = await req.json()
  const tag = await prisma.tag.create({ data: { name } })
  return NextResponse.json(tag)
} 