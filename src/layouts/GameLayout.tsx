import GameMenu from 'components/GameMenu'
import NotificationCenterProvider from 'contexts/NotificationCenter'
import { PropsWithChildren } from 'react'
import styled from 'styled-components/macro'
import PageHeader from '../components/PageHeader'

export const Body = styled.div`
  max-width: 1200px;
  width: 90%;
  display: flex;
  justify-content: space-around;
  margin: var(--header-margin) auto 0;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    width: 100%;
  }
`

const StyledGameMenu = styled(GameMenu)`
  position: absolute;
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
      <NotificationCenterProvider>{children}</NotificationCenterProvider>
      <StyledGameMenu />
    </>
  )
}
