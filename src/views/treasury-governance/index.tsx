import Image from 'next/image'
import Arrow from 'views/store/StoreHero/arrow.svg'
import { GovernanceTab } from 'models/Tabs'
import { useTranslation } from 'next-i18next'
import { useState } from 'react'
import styled, { useTheme } from 'styled-components'
import { ContentMedium, Headline } from 'styles/typography'
import TreasurySection from 'components/TreasurySection'
import OtterClamTab from './OtterClamTab'
import QiDaoTab from './QiDaoTab'
import Garden from './garden.png'
import OtterVote from './otter-vote.png'

const StyledContainer = styled.div``

const StyledBanner = styled.div`
  position: relative;
`

const StyledTabs = styled.div`
  display: flex;
  gap: 10px;
  justify-content: space-around;
  padding: 0 25px;
  position: relative;
`

const StyledTab = styled(ContentMedium).attrs({ as: 'button' })<{ selected?: boolean }>`
  position: relative;
  bottom: -2px;
  padding: 10px 0;
  flex: 1;
  color: ${({ theme }) => theme.colors.superDarkBrown};
  border: 2px solid ${({ theme }) => theme.colors.otterBlack};
  background-color: ${({ theme, selected }) => (selected ? theme.colors.darkYellow : theme.colors.white)};
  box-shadow: ${({ selected }) =>
    selected
      ? 'inset 0px -8px 0px #d88335, inset 0px 0px 0px 6px rgba(255, 255, 255, 0.4)'
      : 'inset 0px -8px 0px rgba(0, 0, 0, 0.2), inset 0px 0px 0px 6px rgba(255, 255, 255, 0.4)'};
  border-radius: 8px 8px 0px 0px;
`

const StyledBody = styled.div`
  padding: 0 15px 0 15px;
`

const StyledDialog = styled.div`
  font-family: 'Pangolin', 'naikaifont' !important;
  color: ${({ theme }) => theme.colors.otterBlack};
  background: white;
  position: relative;
  margin-right: 30%;
  width: max-content;
  border-radius: 20px;
  border: 4px solid ${({ theme }) => theme.colors.otterBlack};
  padding: 20px;

  &:after {
    content: '';
    width: 28px;
    height: 20px;
    background-image: url(${Arrow.src});
    background-size: 100% 100%;
    position: absolute;
    top: calc(50% - 9px);
    right: -30px;
  }
  > h2 {
    width: max-content;
  }
`
const StyledTreasurySection = styled(TreasurySection)`
  display: inline-flex;
  > span {
    display: contents !important;
  }
`

const StyledBg = styled(Image)`
  width: 100%;
  box-shadow: 0 0 0 2px #1d2654, inset 0 0 0 2px #1d2654;
  display: contents;

  span > span > img {
    display: block !important;
  }
`

const StyledOtter = styled(Image)`
  position: relative;
  top: 20%;
  left: 20% !important;
  max-height: unset !important;
`

interface Props {
  className?: string
}

export default function GopvernancePage({ className }: Props) {
  const { t } = useTranslation('', { keyPrefix: 'treasury.governance' })
  const [tab, setTab] = useState<GovernanceTab>(GovernanceTab.OTTERCLAM)
  return (
    <StyledContainer className={className}>
      <StyledTreasurySection>
        <StyledBg unoptimized src={Garden.src} width={2000} height={500} objectFit="none" />
        <StyledDialog>
          <h2>{tab === GovernanceTab.OTTERCLAM ? t('welcome_message_title') : t('qidao_message_title')}</h2>
          <br />
          <p>{tab === GovernanceTab.OTTERCLAM ? t('welcome_message_body') : t('qidao_message_body')}</p>
        </StyledDialog>
        <StyledOtter unoptimized src={OtterVote.src} width={948} height={268} objectFit="contain" />
      </StyledTreasurySection>

      <TreasurySection>
        <StyledTabs>
          <StyledTab selected={tab === GovernanceTab.OTTERCLAM} onClick={() => setTab(GovernanceTab.OTTERCLAM)}>
            {t('otterclam_tab')}
          </StyledTab>
          <StyledTab selected={tab === GovernanceTab.QIDAO} onClick={() => setTab(GovernanceTab.QIDAO)}>
            {t('qidao_tab')}{' '}
          </StyledTab>
        </StyledTabs>
        <StyledBody>
          {tab === GovernanceTab.OTTERCLAM && <OtterClamTab />}
          {tab === GovernanceTab.QIDAO && <QiDaoTab />}
        </StyledBody>
      </TreasurySection>
    </StyledContainer>
  )
}
