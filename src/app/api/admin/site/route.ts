import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

// 获取站点配置
export async function GET() {
  const site = await prisma.site.findFirst()
  return NextResponse.json(site)
}

// 更新站点配置
export async function PUT(req: Request) {
  const { title, subtitle, avatar, bio } = await req.json()
  const site = await prisma.site.upsert({
    where: { id: '1' },
    update: { title, subtitle, avatar, bio },
    create: { id: '1', title, subtitle, avatar, bio }
  })
  return NextResponse.json(site)
}

// 保存站点配置
export async function POST(req: Request) {
  const { title, description, notice } = await req.json()
  let config = await prisma.siteConfig.findFirst()
  if (!config) {
    config = await prisma.siteConfig.create({ data: { title, description, notice } })
  } else {
    config = await prisma.siteConfig.update({
      where: { id: config.id },
      data: { title, description, notice }
    })
  }
  return NextResponse.json(config)
} 