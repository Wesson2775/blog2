import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

// 获取站点配置
export async function GET() {
  try {
    const config = await prisma.siteConfig.findFirst()
    return NextResponse.json(config || {
      title: '只抄',
      subtitle: '个人技术博客，分享技术探索和生活感悟',
      github: 'http://github.com/wesson2775',
      email: '862832617@qq.com',
      description: 'Hi，我是 Kevin。\n欢迎来到 只抄 博客！\n这里记录我的技术、生活与思考。'
    })
  } catch (error) {
    console.error('Failed to fetch site config:', error)
    return NextResponse.json({ error: 'Failed to fetch site config' }, { status: 500 })
  }
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
  try {
    const { title, subtitle, github, email, description } = await req.json()
    
    // 验证必填字段
    if (!title || !subtitle || !github || !email || !description) {
      return NextResponse.json({ error: '所有字段都是必填的' }, { status: 400 })
    }

    // 使用 findFirst 获取现有配置
    const existingConfig = await prisma.siteConfig.findFirst()
    
    if (existingConfig) {
      // 如果存在配置，则更新
      const config = await prisma.siteConfig.update({
        where: { id: existingConfig.id },
        data: {
          title,
          subtitle,
          github,
          email,
          description,
          updatedAt: new Date()
        }
      })
      return NextResponse.json(config)
    } else {
      // 如果不存在配置，则创建
      const config = await prisma.siteConfig.create({
        data: {
          title,
          subtitle,
          github,
          email,
          description,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      })
      return NextResponse.json(config)
    }
  } catch (error) {
    console.error('Failed to save site config:', error)
    return NextResponse.json({ error: '保存站点配置失败' }, { status: 500 })
  }
} 