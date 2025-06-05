import { prisma } from '@/lib/prisma'

export default async function AboutPage() {
  const config = await prisma.siteConfig.findFirst() || {
    title: '',
    subtitle: '',
    description: ''
  }

  return (
    <div className="flex flex-col bg-[#181f2a]">
      <div className="mx-auto max-w-3xl px-4 space-y-4 text-center text-neutral-200 text-base">
        <div className="whitespace-pre-line">{config.description}</div>
        <img src="https://s2.loli.net/2025/04/26/b1AFZT8yrVMjLhn.png" alt="Profile Image" className="mx-auto my-4" />
      </div>
    </div>
  )
} 