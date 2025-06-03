import { NextResponse } from 'next/server'

// 模拟数据
const mockLink = {
  id: '1',
  name: '示例友链',
  url: 'https://example.com',
  description: '这是一个示例友链'
}

// 获取单个友情链接
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  return NextResponse.json(mockLink)
}

// PUT /api/admin/links/:id
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  return NextResponse.json(mockLink)
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  return new NextResponse(null, { status: 204 })
} 