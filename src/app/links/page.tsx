import { prisma } from '@/lib/prisma'

export default async function Links() {
  const links = await prisma.link.findMany()

  return (
    <div className="bg-[#181f2a]">
      <div className="mx-auto max-w-3xl px-4 space-y-4">
        <div className="text-base text-neutral-200 mt-6 mb-2"> 友情链接 </div>
        <ul className="space-y-4">
          {links.map(link => (
            <li key={link.id} className="flex items-center text-lg">
              <span className="text-red-400 mr-1">•</span>
              <a href={link.url} target="_blank" rel="noopener noreferrer" className="mr-2 text-base text-red-400 hover:text-red-400">{link.name}</a>
              <span className="text-base text-neutral-200">{link.description}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
} 