import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// 获取单个友情链接
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const link = await prisma.link.findUnique({
    where: {
      id: params.id
    }
  });
  
  if (!link) {
    return NextResponse.json({ error: 'Link not found' }, { status: 404 });
  }

  return NextResponse.json(link)
}

// PUT /api/admin/links/:id
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  const { name, url, description, published } = body;

  const updatedLink = await prisma.link.update({
    where: {
      id: params.id
    },
    data: {
      name,
      url,
      description,
      published
    }
  });

  return NextResponse.json(updatedLink);
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  return new NextResponse(null, { status: 204 })
} 