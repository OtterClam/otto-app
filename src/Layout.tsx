import { PropsWithChildren } from 'react'
import styled from 'styled-components/macro'
import Footer from './components/Footer'
import PageHeader from './components/PageHeader'

const StyledBody = styled.div`
  max-width: 1200px;
  width: 90%;
  display: flex;
  justify-content: space-around;
  margin: 0 auto;
  max-height: var(--body-height);
  overflow-y: auto;
  overflow-x: hidden;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    width: 100%;
  }
`

interface Props {
  title: string
}

export default function Layout({ title, children }: PropsWithChildren<Props>) {
  return (
    <>
      <PageHeader title={title} />
      <StyledBody>{children}</StyledBody>
      <Footer />
    </>
  )
}
