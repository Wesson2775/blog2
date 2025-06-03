import { prisma } from '@/lib/prisma'

export default async function Links() {
  const links = await prisma.link.findMany()

  return (
    <div className="min-h-screen bg-[#181f2a]">
      <div className="mx-auto max-w-3xl px-4">
        <div className="text-sm text-neutral-200 mb-6">（按添加顺序排序）</div>
        <ul className="space-y-4">
          {links.map(link => (
            <li key={link.id} className="flex items-center text-lg">
              <span className="text-red-400 mr-1">•</span>
              <a href={link.url} target="_blank" rel="noopener noreferrer" className="mr-2 text-sm text-red-400 hover:text-red-500">{link.name}</a>
              <span className="text-sm text-white">{link.description}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
} 