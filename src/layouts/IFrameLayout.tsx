import GameMenu from 'components/GameMenu'
import { PropsWithChildren } from 'react'
import styled from 'styled-components/macro'
import PageHeader from '../components/PageHeader'

const StyledBody = styled.div`
  height: calc(100vh - var(--header-height) - var(--game-menu-height) - 60px);
  display: flex;
  justify-content: space-around;
  padding: var(--header-margin) auto calc(var(--game-menu-height) + 60px);
`

const StyledGameMenu = styled(GameMenu)`
  position: fixed;
  z-index: 1;
  left: 0;
  bottom: 0;
  width: 100%;
`

import { createGlobalStyle } from 'styled-components/macro'

const GlobalStyle = createGlobalStyle`
  body {
    background-image: none;
    background-color: #fff;
  }
`

interface Props {
  title: string
}

export default function IFrameLayout({ title, children }: PropsWithChildren<Props>) {
  return (
    <>
      <GlobalStyle />
      <PageHeader title={title} />
      <StyledBody>{children}</StyledBody>
      <StyledGameMenu />
    </>
  )
}
