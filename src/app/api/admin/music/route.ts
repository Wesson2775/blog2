import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

// 获取所有音乐
export async function GET(req: Request) {
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
}

// 新建音乐
export async function POST(req: Request) {
  const { title, artist, cover, src } = await req.json()
  const song = await prisma.music.create({ data: { title, artist, cover, src } })
  return NextResponse.json(song)
}

// 更新音乐
export async function PUT(req: Request) {
  const { id, published } = await req.json()
  const music = await prisma.music.update({
    where: { id },
    data: { published }
  })
  return NextResponse.json(music)
} 