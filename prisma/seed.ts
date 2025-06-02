import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // 创建标签
  const tags = await Promise.all([
    prisma.tag.create({
      data: { name: 'Next.js' },
    }),
    prisma.tag.create({
      data: { name: 'React' },
    }),
    prisma.tag.create({
      data: { name: 'TypeScript' },
    }),
  ])

  // 创建文章
  await prisma.post.create({
    data: {
      title: '使用 Next.js 14 构建现代化博客',
      slug: 'building-modern-blog-with-nextjs-14',
      content: `
# 使用 Next.js 14 构建现代化博客

Next.js 14 带来了许多激动人心的新特性，让我们来看看如何使用它构建一个现代化的博客系统。

## 主要特性

- App Router
- Server Components
- 流式渲染
- 部分预渲染
- 改进的缓存机制

## 开始使用

首先，我们需要创建一个新的 Next.js 项目：

\`\`\`bash
npx create-next-app@latest my-blog
\`\`\`

## 配置数据库

我们使用 Prisma 作为 ORM，它提供了类型安全和强大的查询功能。

## 部署

使用 Vercel 部署非常简单，只需要将代码推送到 GitHub 即可。
      `,
      excerpt: '探索如何使用 Next.js 14 的新特性构建一个现代化的博客系统。',
      coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c',
      published: true,
      tags: {
        connect: tags.map(tag => ({ id: tag.id })),
      },
    },
  })

  await prisma.post.create({
    data: {
      title: 'TypeScript 最佳实践',
      slug: 'typescript-best-practices',
      content: `
# TypeScript 最佳实践

TypeScript 是一个强大的类型系统，让我们来看看一些最佳实践。

## 类型定义

使用接口和类型别名来定义数据结构。

## 泛型

泛型可以帮助我们编写更灵活的代码。

## 类型推断

让 TypeScript 自动推断类型，减少冗余代码。
      `,
      excerpt: '学习 TypeScript 的最佳实践，提高代码质量和开发效率。',
      coverImage: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea',
      published: true,
      tags: {
        connect: [{ id: tags[2].id }], // 只连接 TypeScript 标签
      },
    },
  })
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 