import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'

export default function MarkdownWithHtml({ children, className }: { children: string; className?: string }) {
  return (
    <ReactMarkdown className={className} rehypePlugins={[rehypeRaw]}>
      {children}
    </ReactMarkdown>
  )
}
