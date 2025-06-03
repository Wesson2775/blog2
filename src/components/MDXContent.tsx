import { serialize } from 'next-mdx-remote/serialize'
import remarkGfm from 'remark-gfm'
import rehypePrism from 'rehype-prism-plus'
import MDXRenderer from './MDXRenderer'

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

  return <MDXRenderer source={mdxSource} />
} 