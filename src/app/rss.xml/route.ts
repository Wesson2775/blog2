import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // 获取站点配置
    const siteConfig = await prisma.siteConfig.findFirst()
    
    // 获取已发布的文章
    const posts = await prisma.post.findMany({
      where: {
        published: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 20
    })

    // 生成 RSS XML
    const rss = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${siteConfig?.title || '只抄'}</title>
    <description>${siteConfig?.subtitle || '个人技术博客，分享技术探索和生活感悟'}</description>
    <link>${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}</link>
    <atom:link href="${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/rss.xml" rel="self" type="application/rss+xml" />
    <language>zh-CN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${posts.map(post => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <description><![CDATA[${post.excerpt || ''}]]></description>
      <link>${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/posts/${post.slug}</link>
      <guid>${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/posts/${post.slug}</guid>
      <pubDate>${new Date(post.createdAt).toUTCString()}</pubDate>
    </item>
    `).join('')}
  </channel>
</rss>`

    return new NextResponse(rss, {
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600'
      }
    })
  } catch (error) {
    console.error('生成 RSS 失败:', error)
    return new NextResponse('生成 RSS 失败', { status: 500 })
  }
} 