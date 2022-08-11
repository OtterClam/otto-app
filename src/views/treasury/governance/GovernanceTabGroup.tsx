import { useTranslation } from 'next-i18next'
import { useState } from 'react'
import styled from 'styled-components'
import { ContentMedium } from 'styles/typography'
import UnstakeTab from '../stake/UnstakeTab'
import DystopiaPenroseTab from './DystopiaPenroseTab'
import OtterClamTab from './OtterClamTab'
import QiDaoTab from './QiDaoTab'

const StyledStakeDialog = styled.div``

const StyledTabs = styled.div`
  display: flex;
  gap: 10px;
  justify-content: space-around;
  padding: 0 20px;
  position: relative;
`

const StyledTab = styled(ContentMedium).attrs({ as: 'button' })<{ selected?: boolean }>`
  position: relative;
  bottom: -2px;
  padding: 10px 0;
  flex: 1;
  color: ${({ theme }) => theme.colors.otterBlack};
  border: 2px solid ${({ theme }) => theme.colors.otterBlack};
  background-color: ${({ theme, selected }) => (selected ? theme.colors.darkYellow : theme.colors.white)};
  box-shadow: ${({ selected }) =>
    selected
      ? 'inset 0px -8px 0px #d88335, inset 0px 0px 0px 6px rgba(255, 255, 255, 0.4)'
      : 'inset 0px -8px 0px rgba(0, 0, 0, 0.2), inset 0px 0px 0px 6px rgba(255, 255, 255, 0.4)'};
  border-radius: 8px 8px 0px 0px;
`

const StyledBody = styled.div`
  padding: 20px;
  border: 2px solid ${({ theme }) => theme.colors.otterBlack};
  border-radius: 20px;
  background: ${({ theme }) => theme.colors.white};
`

type GovernanceTab = 'otterclam' | 'dyst_pen' | 'qidao'

interface Props {
  className?: string
}

export default function GopvernanceTabGroup({ className }: Props) {
  const { t } = useTranslation('', { keyPrefix: 'governance' })
  // const { proposals } = useOtterClamProposals()
  const [tab, setTab] = useState<GovernanceTab>('otterclam')
  return (
    <StyledStakeDialog className={className}>
      <StyledTabs>
        <StyledTab selected={tab === 'otterclam'} onClick={() => setTab('otterclam')}>
          {t('otterclam_tab')}{' '}
        </StyledTab>
        <StyledTab selected={tab === 'dyst_pen'} onClick={() => setTab('dyst_pen')}>
          {t('dyst_pen_tab')}{' '}
        </StyledTab>
        <StyledTab selected={tab === 'qidao'} onClick={() => setTab('qidao')}>
          {t('qidao_tab')}{' '}
        </StyledTab>
      </StyledTabs>
      <StyledBody>
        {tab === 'otterclam' && <OtterClamTab />}
        {tab === 'dyst_pen' && <DystopiaPenroseTab />}
        {tab === 'qidao' && <QiDaoTab />}
      </StyledBody>
    </StyledStakeDialog>
  )
}