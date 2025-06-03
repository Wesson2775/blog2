import { prisma } from '@/lib/prisma'

export default async function AboutPage() {
  const config = await prisma.siteConfig.findFirst() || {
    title: '只抄',
    subtitle: '个人技术博客，分享技术探索和生活感悟',
    github: 'http://github.com/wesson2775',
    email: '862832617@qq.com',
    description: 'Hi，我是 Kevin。\n欢迎来到 只抄 博客！\n这里记录我的技术、生活与思考。'
  }

  return (
    <div className="flex flex-col bg-[#181f2a]">
      <div className="mx-auto max-w-3xl px-4 space-y-4 text-center text-neutral-200 text-base">
        <div className="whitespace-pre-line">{config.description}</div>
        <img src="https://s2.loli.net/2025/06/03/G1hctQ5LjUDXsua.png" alt="Profile Image" className="mx-auto my-4" />
        <div>联系邮箱：{config.email}</div>
        <div>GitHub：<a href={config.github} target="_blank" rel="noopener noreferrer" className="text-red-400 hover:text-red-400">{config.github}</a></div>
      </div>
    </div>
  )
} 