import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

// 获取所有音乐
export async function GET() {
  const songs = await prisma.music.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(songs)
}

// 新建音乐
export async function POST(req: Request) {
  const { title, artist, cover, src } = await req.json()
  const song = await prisma.music.create({ data: { title, artist, cover, src } })
  return NextResponse.json(song)
} 