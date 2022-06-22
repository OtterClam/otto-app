import styled from 'styled-components/macro'
import { Caption, ContentMedium } from 'styles/typography'
import ReactMarkdown from 'react-markdown'

const StyledFAQ = styled.div`
  width: 100%;
`

const StyledQuestion = styled(ContentMedium).attrs({ as: 'h3' })`
  padding: 20px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.lightGray300};
`

const StyledAnswer = styled(Caption).attrs({ as: 'div' })`
  padding: 20px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.lightGray300};
  a {
    color: ${({ theme }) => theme.colors.otterBlue};
  }
`

interface Props {
  question: string
  answer: string
}

export default function FAQ({ question, answer }: Props) {
  return (
    <StyledFAQ>
      <StyledQuestion>{question}</StyledQuestion>
      <StyledAnswer>
        <ReactMarkdown>{answer}</ReactMarkdown>
      </StyledAnswer>
    </StyledFAQ>
  )
}
