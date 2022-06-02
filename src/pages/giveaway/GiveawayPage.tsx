import axios from 'axios'
import BorderContainer from 'components/BorderContainer'
import Layout from 'Layout'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import styled, { keyframes } from 'styled-components/macro'
import { ContentMedium, Display2 } from 'styles/typography'
import Silver from 'models/store/images/silver.png'
import Star from 'assets/ui/star.svg'
import GiveawaySteps from './GiveawaySteps'
import HeroBg from './hero-bg.png'

const StyledGiveawayPage = styled.div`
  display: flex;
  flex-direction: column;
  padding: 40px 0;
  align-items: center;
  background: ${({ theme }) => theme.colors.otterBlack};
  color: ${({ theme }) => theme.colors.white};
`

const StyledHeadline = styled(Display2).attrs({ as: 'h1' })``

const StyledSubtitle = styled(ContentMedium).attrs({ as: 'h2' })``

const StyledHero = styled.div`
  display: flex;
  justify-content: center;
  width: 640px;
  background-image: url(${HeroBg});
  background-repeat: no-repeat;
  background-size: contain;
  background-position: top;
`

const Spin = keyframes`
	from{transform:rotate(0deg)}
	to{transform:rotate(360deg)}
`

const StyledSliverChestContainer = styled.div`
  width: 360px;
  height: 360px;
  position: relative;

  > * {
    position: relative;
  }

  &:before {
    content: ' ';
    position: absolute;
    width: 360px;
    height: 360px;
    background: url(${Star}) no-repeat;
    background-size: 100% 100%;
    top: 0;
    left: 0;
    animation: ${Spin} 12s linear infinite;
  }
`

const StyledBody = styled(BorderContainer)`
  width: 640px;
  background: ${({ theme }) => theme.colors.white};
  color: ${({ theme }) => theme.colors.otterBlack};
  padding: 42px 35px;
  display: flex;
  flex-direction: column;
  align-items: center;
`

export default function GiveawayPage() {
  const { t } = useTranslation('', { keyPrefix: 'giveaway' })
  return (
    <Layout title={t('title')}>
      <StyledGiveawayPage>
        <StyledHeadline>{t('headline')}</StyledHeadline>
        <StyledSubtitle>{t('subtitle')}</StyledSubtitle>
        <StyledHero>
          <StyledSliverChestContainer>
            <img src={Silver} alt="silver" width="100%" />
          </StyledSliverChestContainer>
        </StyledHero>
        <StyledBody>
          <GiveawaySteps />
        </StyledBody>
      </StyledGiveawayPage>
    </Layout>
  )
}
