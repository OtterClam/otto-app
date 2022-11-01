import GameMenu from 'components/GameMenu'
import { PropsWithChildren } from 'react'
import styled from 'styled-components/macro'
import PageHeader from '../components/PageHeader'

const StyledBody = styled.div`
  max-width: 1200px;
  width: 90%;
  display: flex;
  justify-content: space-around;
  margin: var(--header-margin) auto calc(var(--game-menu-height) + 20px);

  @media ${({ theme }) => theme.breakpoints.mobile} {
    width: 100%;
  }
`

const StyledGameMenu = styled(GameMenu)`
  position: fixed;
  z-index: 1;
  left: 0;
  bottom: 0;
  width: 100%;
`

interface Props {
  title: string
}

export default function DefaultLayout({ title, children }: PropsWithChildren<Props>) {
  return (
    <>
      <PageHeader title={title} />
      <StyledBody>{children}</StyledBody>
      <StyledGameMenu />
    </>
  )
}
