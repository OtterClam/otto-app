import { createPortal } from 'react-dom'
import { useDispatch, useSelector } from 'react-redux'
import { hideSideMenu, selectShowSideMenu } from 'store/uiSlice'
import { CSSTransition } from 'react-transition-group'
import styled from 'styled-components/macro'
import { MouseEventHandler, useCallback } from 'react'
import { ContentExtraSmall } from 'styles/typography'
import Image from 'next/image'
import { useEthers } from '@usedapp/core'
import { useTranslation } from 'next-i18next'
import logoImage from './Logo.png'
import Account from './Account'
import LanguageSelector from './LanguageSelector'
import More from './More'
import SocialLinks from './SocialLinks'

const StyledContainer = styled.div`
  display: flex;
  position: fixed;
  z-index: var(--z-index-side-menu);
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  justify-content: end;
  align-items: scratch;

  &.fade-enter {
    opacity: 0;
  }

  &.fade-enter-active {
    opacity: 1;
    transition: opacity 0.2s;
  }

  &.fade-exit {
    opacity: 1;
  }

  &.fade-exit-active {
    opacity: 0;
    transition: opacity 0.2s;
  }
`

const StyledIcon = styled.div`
  text-align: center;
`

const StyledContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 300px;
  background: ${({ theme }) => theme.colors.darkGray400};
  padding: 30px;

  &.slide-enter {
    transform: translate(300px);
  }

  &.slide-enter-active {
    transform: translate(0);
    transition: transform 0.2s;
  }

  &.slide-exit {
    transform: translate(0);
  }

  &.slide-exit-active {
    transform: translate(300px);
    transition: transform 0.2s;
  }
`

const StyledSection = styled.div``

const StyledTitle = styled(ContentExtraSmall).attrs({ as: 'h3' })`
  color: ${({ theme }) => theme.colors.white};
  margin-bottom: 10px;
`

export default function SideMenu() {
  const show = useSelector(selectShowSideMenu)
  const dispatch = useDispatch()
  const { t } = useTranslation('', { keyPrefix: 'side_menu' })
  const { account } = useEthers()

  const hideMenu = useCallback(() => {
    dispatch(hideSideMenu())
  }, [])

  const stopPropagation: MouseEventHandler = useCallback(e => {
    e.stopPropagation()
  }, [])

  return createPortal(
    <CSSTransition unmountOnExit in={show} timeout={200} classNames="fade">
      <StyledContainer onClick={hideMenu}>
        <CSSTransition unmountOnExit in={show} timeout={200} classNames="slide">
          <StyledContent onClick={stopPropagation}>
            <StyledIcon>
              <Image src={logoImage} width={logoImage.width / 2} height={logoImage.height / 2} />
            </StyledIcon>

            {account && <Account />}

            <StyledSection>
              <StyledTitle>{t('select_language')}</StyledTitle>
              <LanguageSelector />
            </StyledSection>

            <StyledSection>
              <StyledTitle>{t('more')}</StyledTitle>
              <More />
            </StyledSection>

            <StyledSection>
              <StyledTitle>{t('follow_us')}</StyledTitle>
              <SocialLinks />
            </StyledSection>
          </StyledContent>
        </CSSTransition>
      </StyledContainer>
    </CSSTransition>,
    document.querySelector('#modal-root')!
  )
}
