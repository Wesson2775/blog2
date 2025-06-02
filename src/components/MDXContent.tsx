import { MDXRemote } from 'next-mdx-remote'
import { serialize } from 'next-mdx-remote/serialize'
import remarkGfm from 'remark-gfm'
import rehypePrism from 'rehype-prism-plus'

interface MDXContentProps {
  content: string
}

export default async function MDXContent({ content }: MDXContentProps) {
  const mdxSource = await serialize(content, {
    mdxOptions: {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [rehypePrism],
    },
  })

  return (
    <div className="prose dark:prose-invert max-w-none">
      <MDXRemote {...mdxSource} />
    </div>
  )
} 