import { useTranslation } from 'next-i18next'
import { useState } from 'react'
import styled from 'styled-components'
import { ContentMedium } from 'styles/typography'
import StakeTab from './StakeTab'
import UnstakeTab from './UnstakeTab'

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

enum Tab {
  Stake,
  Unstake,
}

interface Props {
  className?: string
}

export default function StakeDialog({ className }: Props) {
  const { t } = useTranslation('', { keyPrefix: 'bank' })
  const [tab, setTab] = useState<Tab>(Tab.Stake)

  return (
    <StyledStakeDialog className={className}>
      <StyledTabs>
        <StyledTab selected={tab === Tab.Stake} onClick={() => setTab(Tab.Stake)}>
          {t('stake_tab')}{' '}
        </StyledTab>
        <StyledTab selected={tab === Tab.Unstake} onClick={() => setTab(Tab.Unstake)}>
          {t('unstake_tab')}{' '}
        </StyledTab>
      </StyledTabs>
      <StyledBody>
        {tab === Tab.Stake && <StakeTab />}
        {tab === Tab.Unstake && <UnstakeTab />}
      </StyledBody>
    </StyledStakeDialog>
  )
}
