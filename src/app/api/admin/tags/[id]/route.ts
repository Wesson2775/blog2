import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

// GET /api/admin/tags/:id
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const tag = await prisma.tag.findUnique({
      where: { id: params.id },
    });
    if (!tag) {
      return NextResponse.json({ error: 'Tag not found' }, { status: 404 });
    }
    return NextResponse.json(tag);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching tag' }, { status: 500 });
  }
}

// PUT /api/admin/tags/:id
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { name, published } = await req.json();
    const updatedTag = await prisma.tag.update({
      where: { id: params.id },
      data: { name, published },
    });
    return NextResponse.json(updatedTag);
  } catch (error) {
    return NextResponse.json({ error: 'Error updating tag' }, { status: 500 });
  }
}

// DELETE /api/admin/tags/:id
export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.tag.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting tag' }, { status: 500 });
  }
} 