import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = searchParams.get('q')?.trim() || ''
  const page = parseInt(searchParams.get('page') || '1', 10)
  const pageSize = 5

  const where = q
    ? {
        published: true,
        OR: [
          { title: { contains: q, mode: 'insensitive' } },
          { content: { contains: q, mode: 'insensitive' } },
        ],
      }
    : { published: true }

  try {
    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        include: { tags: true },
        orderBy: [{ pinned: 'desc' }, { createdAt: 'desc' }],
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.post.count({ where }),
    ])

    return NextResponse.json({
      posts,
      total,
      totalPages: Math.ceil(total / pageSize),
      currentPage: page,
    })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { error: '搜索失败' },
      { status: 500 }
    )
  }
} 