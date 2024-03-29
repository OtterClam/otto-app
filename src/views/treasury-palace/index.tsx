import { PalaceTab } from 'models/Tabs'
import { useTranslation } from 'next-i18next'
import TreasuryDashboardPage from 'views/treasury-dashboard'
import { useMemo, useEffect, useState } from 'react'
import styled, { useTheme } from 'styled-components'
import { ContentMedium } from 'styles/typography'
import GovernancePage from 'views/treasury-governance'
import InvestmentsPage from 'views/treasury-investments'
import Link from 'next/link'
import useOtterClamProposalsWithVotes from 'hooks/useOtterClamProposalsWithVotes'

const StyledTabs = styled.div`
  display: flex;
  gap: 10px;
  justify-content: space-around;
  padding: 0 20px;
  position: relative;
`

const StyledTab = styled(ContentMedium).attrs({ as: 'button' })<{ selected?: boolean; disabled?: boolean }>`
  position: relative;
  bottom: -2px;
  padding: 10px 0;
  flex: 1;
  color: ${({ theme }) => theme.colors.superDarkBrown};
  border: 2px solid ${({ theme }) => theme.colors.otterBlack};
  background-color: ${({ theme, selected, disabled }) =>
    selected ? theme.colors.darkYellow : disabled ? theme.colors.darkGray100 : theme.colors.white};
  box-shadow: ${({ selected }) =>
    selected
      ? 'inset 0px -8px 0px #d88335, inset 0px 0px 0px 6px rgba(255, 255, 255, 0.4)'
      : 'inset 0px -8px 0px rgba(0, 0, 0, 0.2), inset 0px 0px 0px 6px rgba(255, 255, 255, 0.4)'};
  border-radius: 8px 8px 0px 0px;
`

const StyledToolTip = styled.div`
  background: ${({ theme }) => theme.colors.clamPink};
  border: 1px solid ${({ theme }) => theme.colors.otterBlack};
  padding: 1px 10px !important;
  width: 90px;
  opacity: 1 !important;
  border-radius: 5px !important;
  position: absolute;
  bottom: 60%;
  right: -10%;
  color: white;
  transform: rotate(25deg);
  font-size: 14px;
`
const StyledBody = styled.div``

export default function PalacePage() {
  const { t } = useTranslation('', { keyPrefix: 'treasury' })
  const [tab, setTab] = useState<PalaceTab>(PalaceTab.DASHBOARD)
  const theme = useTheme()
  const { proposalActive } = useOtterClamProposalsWithVotes()

  useEffect(() => {
    if (!window) return
    if (window.location.hash === '#dashboard') setTab(PalaceTab.DASHBOARD)
    if (window.location.hash === '#investments') setTab(PalaceTab.INVESTMENTS)
    if (window.location.hash === '#governance') setTab(PalaceTab.GOVERNANCE)
  }, [])

  return (
    <div>
      <StyledTabs>
        <Link href="#dashboard" replace>
          <StyledTab selected={tab === PalaceTab.DASHBOARD} onClick={() => setTab(PalaceTab.DASHBOARD)}>
            {t('dashboard_tab')}{' '}
          </StyledTab>
        </Link>
        <Link href="#investments" replace>
          <StyledTab selected={tab === PalaceTab.INVESTMENTS} onClick={() => setTab(PalaceTab.INVESTMENTS)}>
            {t('investments_tab')}{' '}
          </StyledTab>
        </Link>
        <Link href="#governance" replace>
          <StyledTab selected={tab === PalaceTab.GOVERNANCE} onClick={() => setTab(PalaceTab.GOVERNANCE)}>
            {t('governance_tab')}

            {proposalActive && <StyledToolTip>{t('governance.voteNow')}</StyledToolTip>}
          </StyledTab>
        </Link>
      </StyledTabs>
      <StyledBody>
        {tab === PalaceTab.DASHBOARD && <TreasuryDashboardPage />}
        {tab === PalaceTab.GOVERNANCE && <GovernancePage />}
        {tab === PalaceTab.INVESTMENTS && <InvestmentsPage />}
      </StyledBody>
    </div>
  )
}
