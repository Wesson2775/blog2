import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

// GET /api/admin/music/:id
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const music = await prisma.music.findUnique({
      where: { id: params.id },
    });
    if (!music) {
      return NextResponse.json({ error: 'Music not found' }, { status: 404 });
    }
    return NextResponse.json(music);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching music' }, { status: 500 });
  }
}

// PUT /api/admin/music/:id
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { title, artist, cover, src, published } = await req.json();
    const updatedMusic = await prisma.music.update({
      where: { id: params.id },
      data: { title, artist, cover, src, published },
    });
    return NextResponse.json(updatedMusic);
  } catch (error) {
    return NextResponse.json({ error: 'Error updating music' }, { status: 500 });
  }
}

// DELETE /api/admin/music/:id
export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.music.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: 'Error deleting music' }, { status: 500 });
  }
} 