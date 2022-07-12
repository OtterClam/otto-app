import dynamic from 'next/dynamic'
import AdBanner from 'components/AdBanner'
import TreasuryCard from 'components/TreasuryCard'
import TreasurySection from 'components/TreasurySection'
import { useTranslation } from 'next-i18next'
import styled from 'styled-components/macro'
import { ContentExtraSmall, ContentMedium, ContentSmall } from 'styles/typography'
// import ClamIcon from 'assets/clam.png'
// import PearlIcon from 'assets/pearl.png'
// import Help from 'components/Help'
import useGovernanceMetrics from 'hooks/useGovernanceMetrics'
import { trim } from 'helpers/trim'
import { BigNumber, BigNumberish, ethers } from 'ethers'
import { useMemo } from 'react'
import useOtterClamProposals from 'hooks/useSnapshotProposals'
import useTreasuryMetrics from 'hooks/useTreasuryMetrics'

const StyledMetricsContainer = styled.div`
  position: relative;
  margin: 24px 34px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-gap: 20px;

  &::before {
    content: '';
    position: absolute;
    top: -35px;
    right: -45px;
    width: 77px;
    height: 56px;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -24px;
    right: -35px;
    width: 105px;
    height: 85px;
  }

  @media ${({ theme }) => theme.breakpoints.mobile} {
    grid-template-columns: 1fr 1fr;
    grid-gap: 5px;
    margin: 5px;

    &::before {
      width: 51px;
      height: 37px;
      background-size: 51px 37px;
      right: -16px;
      top: -16px;
    }

    &::after {
      width: 70px;
      height: 57px;
      background-size: 70px 57px;
      right: -6px;
      bottom: -5px;
    }
  }
`
// background: center / 77px 56px url(${Shell.src});
// background: center / 105px 85px url(${Leaves.src});

const StyledTreasuryCard = styled(TreasuryCard)`
  height: 80px;
  display: flex;
  flex-direction: column;
`

const StyledChartCard = styled(TreasuryCard)`
  min-height: 260px;
`

const StyledTokenContainer = styled.div`
  display: grid;
  grid-template-areas:
    'label icon'
    'price icon';
  grid-template-columns: 1fr 48px;
`

const StyledTokenLabel = styled(ContentExtraSmall)`
  grid-area: label;
`

const StyledTokenPrice = styled(ContentMedium)`
  grid-area: price;
`

const StyledTokenIcon = styled.img`
  grid-area: icon;
  width: 48px;
  height: 48px;
`

const StyledChartsContainer = styled(ContentMedium)`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 20px;
  margin: 24px 34px;

  &::before {
    content: '';
    z-index: 1;
    position: absolute;
    top: -48px;
    left: -10px;
    width: 94px;
    height: 118px;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -35px;
    right: -25px;
    width: 126px;
    height: 125px;
  }

  @media ${({ theme }) => theme.breakpoints.mobile} {
    grid-template-columns: 1fr;
    grid-gap: 5px;
    margin: 5px;

    &::before {
      width: 63px;
      height: 79px;
      background-size: 63px 79px;
      right: -16px;
      top: -35px;
    }

    &::after {
      width: 84px;
      height: 83px;
      background-size: 84px 83px;
      right: -12px;
      bottom: -20px;
    }
  }
`
// background: center / 94px 118px url(${Bird.src});
// background: center / 126px 125px url(${Turtle.src});

const StyledChartHeader = styled.h3`
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
`

const StyledChartTitle = styled(ContentSmall)`
  color: ${({ theme }) => theme.colors.darkGray200};
`

const StyledChartKeyValue = styled.span``

const StyledChartKeyDate = styled.span`
  color: ${({ theme }) => theme.colors.darkGray200};
  margin-left: 6px;
`

const formatFinancialNumber = (num: BigNumberish, decimal = 9) => `$${formatBigNumber(num, decimal)}`

const formatBigNumber = (num: BigNumberish, decimal = 9) => trim(ethers.utils.formatUnits(num, decimal), 2)

const formatNormalNumber = (num: number) => num.toFixed(2)

export default function GovernancePage() {
  const { t } = useTranslation('', { keyPrefix: 'treasury.dashboard' })
  const { metrics } = useGovernanceMetrics()
  const { proposals } = useOtterClamProposals()

  return (
    <div>
      <TreasurySection>
        <StyledMetricsContainer>
          <StyledTreasuryCard>
            <StyledTokenContainer>
              <StyledTokenLabel></StyledTokenLabel>
              {/* <StyledTokenPrice>{clamPrice ? formatFinancialNumber(clamPrice) : '--'}</StyledTokenPrice>
              <StyledTokenIcon src={ClamIcon.src} /> */}
            </StyledTokenContainer>
          </StyledTreasuryCard>
        </StyledMetricsContainer>
      </TreasurySection>

      <TreasurySection showRope={false}>
        <StyledChartsContainer>
          <StyledChartCard>
            <StyledChartHeader>
              <StyledChartTitle>{t('treasuryMarketValue')}</StyledChartTitle>
              <StyledChartKeyValue>
                {12}
                <StyledChartKeyDate>{t('today')}</StyledChartKeyDate>
              </StyledChartKeyValue>
            </StyledChartHeader>
            {/* <GovernanceMarketValueChart data={metrics} /> */}
          </StyledChartCard>
        </StyledChartsContainer>
      </TreasurySection>
    </div>
  )
}
