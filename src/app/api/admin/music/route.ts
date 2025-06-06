import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'

// 获取所有音乐
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const search = searchParams.get('search') || ''

    const songs = await prisma.music.findMany({
      where: {
        OR: [
          { title: { contains: search } },
          { artist: { contains: search } }
        ]
      },
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(songs)
  } catch (error) {
    console.error('Failed to fetch music:', error)
    return NextResponse.json({ error: '获取音乐列表失败' }, { status: 500 })
  }
}

// 新建音乐
export async function POST(req: Request) {
  try {
    const { title, artist, cover, src, published } = await req.json()
    
    // 验证必填字段
    if (!title || !src) {
      return NextResponse.json({ error: '歌曲名称和音频链接不能为空' }, { status: 400 })
    }

    // 验证 URL 格式
    try {
      if (cover) new URL(cover)
      new URL(src)
    } catch (e) {
      return NextResponse.json({ error: '音频链接或封面图片链接格式不正确' }, { status: 400 })
    }

    const song = await prisma.music.create({ 
      data: { 
        title, 
        artist, 
        cover, 
        src,
        published: published ?? true // 如果没有提供 published，默认为 true
      } 
    })
    return NextResponse.json(song)
  } catch (error) {
    console.error('Failed to create music:', error)
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return NextResponse.json({ error: '该音乐已存在' }, { status: 400 })
    }
    return NextResponse.json({ error: '创建音乐失败' }, { status: 500 })
  }
}

// 更新音乐
export async function PUT(req: Request) {
  try {
    const { id, published } = await req.json()
    const music = await prisma.music.update({
      where: { id },
      data: { published }
    })
    return NextResponse.json(music)
  } catch (error) {
    console.error('Failed to update music:', error)
    return NextResponse.json({ error: '更新音乐失败' }, { status: 500 })
  }
} 