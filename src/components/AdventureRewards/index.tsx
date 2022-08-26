import HelpButton from 'components/HelpButton'
import SectionRope from 'components/SectionRope'
import TreasurySection from 'components/TreasurySection'
import { useTranslation } from 'next-i18next'
import styled from 'styled-components/macro'
import { ContentExtraSmall, Note } from 'styles/typography'

const StyledLocationDetails = styled.div`
  display: flex;
  gap: 5px;
  flex-wrap: nowrap;
`

const StyledLocationDetail = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1 33%;
  background: ${({ theme }) => theme.colors.darkGray400};
  border: 1px ${({ theme }) => theme.colors.lightBrown} solid;
  border-radius: 5px;
  box-sizing: border-box;
  padding: 2px 0;
`

const StyledLocationDetailLabel = styled(Note)`
  display: flex;
  color: ${({ theme }) => theme.colors.white};
  line-height: 18px;
  gap: 5px;
`

const StyledLocationDetailValue = styled(ContentExtraSmall)`
  color: ${({ theme }) => theme.colors.crownYellow};
  line-height: 24px;
`

const StyledSection = styled(TreasurySection)`
  background: ${({ theme }) => theme.colors.darkGray400};
`

const StyledReward = styled.div``

const StyledRewardIcon = styled.div``

const StyledRewardValue = styled.div``

export default function AdventureRewards() {
  const { t } = useTranslation()

  return (
    <div>
      <StyledLocationDetails>
        <StyledLocationDetail>
          <StyledLocationDetailLabel>
            {t('adventureLocation.successRate')} <HelpButton message={t('adventureLocation.successRateHelp')} />
          </StyledLocationDetailLabel>
          <StyledLocationDetailValue>30%</StyledLocationDetailValue>
        </StyledLocationDetail>
        <StyledLocationDetail>
          <StyledLocationDetailLabel>{t('adventureLocation.adventureTime')}</StyledLocationDetailLabel>
          <StyledLocationDetailValue>8 hours</StyledLocationDetailValue>
        </StyledLocationDetail>
        <StyledLocationDetail>
          <StyledLocationDetailLabel>
            {t('adventureLocation.restingTime')} <HelpButton message={t('adventureLocation.restingTimeHelp')} />
          </StyledLocationDetailLabel>
          <StyledLocationDetailValue>8 hours</StyledLocationDetailValue>
        </StyledLocationDetail>
      </StyledLocationDetails>

      <SectionRope />

      <StyledSection showRope={false}>
        <StyledReward>
          <StyledRewardIcon />
          <StyledRewardValue>+50 EXP</StyledRewardValue>
        </StyledReward>

        <StyledReward>
          <StyledRewardIcon />
          <StyledRewardValue>1~3 items</StyledRewardValue>
        </StyledReward>

        <StyledReward>
          <StyledRewardIcon />
          <StyledRewardValue>+10 tcp</StyledRewardValue>
        </StyledReward>
      </StyledSection>
    </div>
  )
}
