import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import styled from 'styled-components/macro'

const StyledMarkdown = styled(ReactMarkdown)`
  text-align: left;

  strong {
    color: ${props => props.theme.colors.clamPink};
  }

  ul {
    margin: 1em 0 1em 1em;
  }
`

export default function MarkdownWithHtml({ children, className }: { children: string; className?: string }) {
  return (
    <StyledMarkdown className={className} rehypePlugins={[rehypeRaw]}>
      {children}
    </StyledMarkdown>
  )
}
