import HelpButton from 'components/HelpButton'
import SectionRope from 'components/SectionRope'
import TreasurySection from 'components/TreasurySection'
import { formatDuration } from 'date-fns'
import { useTranslation } from 'next-i18next'
import styled from 'styled-components/macro'
import { ContentExtraSmall, Note } from 'styles/typography'
import tcpImage from 'assets/adventure/reward/tcp.png'
import expImage from 'assets/adventure/reward/exp.png'
import itemsImage from 'assets/adventure/reward/items.png'
import AdventureRibbonText from 'components/AdventureRibbonText'
import { useAdventureLocation } from 'contexts/AdventureLocation'
import { BoostTarget } from 'models/AdventureLocation'

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
  display: flex;
  background: ${({ theme }) => theme.colors.darkGray400};
  color: ${({ theme }) => theme.colors.white};
  padding: 15px;
`

const StyledReward = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const StyledRewardIcon = styled.div<{ icon: string }>`
  width: 48px;
  height: 48px;
  background: center / cover url(${({ icon }) => icon});
`

const StyledRewardValue = styled(Note)``

const StyledTitle = styled.div`
  display: flex;
  justify-content: center;
  position: relative;
  z-index: 2;
  margin-top: -12px;
  margin-bottom: -8px;
`

const StyledRope = styled(SectionRope)`
  height: 30px;
`

export default function AdventureRewards() {
  const { t } = useTranslation()
  const location = useAdventureLocation()
  const effectiveBoosts = (location?.conditionalBoosts ?? []).filter(boost => boost.effective)
  const itemReward = effectiveBoosts.reduce(
    ([min, max], boost) => {
      const artwork = boost.amounts[BoostTarget.AdditionalArtwork]
      const item = boost.amounts[BoostTarget.AdditionalItem]

      if (artwork) {
        max += artwork.value
        if (artwork.percentage === 100) {
          min += artwork.value
        }
      }

      if (item) {
        max += item.value
        if (item.percentage === 100) {
          min += item.value
        }
      }

      return [min, max]
    },
    [0, 0]
  )

  if (location?.successRewards.item) {
    itemReward[0] += location.successRewards.item.min ?? 0
    itemReward[1] += location.successRewards.item.max ?? 0
  }

  return (
    <div>
      {location && (
        <>
          <StyledLocationDetails>
            <StyledLocationDetail>
              <StyledLocationDetailLabel>
                {t('adventureLocation.successRate')} <HelpButton message={t('adventureLocation.successRateHelp')} />
              </StyledLocationDetailLabel>
              <StyledLocationDetailValue>{location.successRate}%</StyledLocationDetailValue>
            </StyledLocationDetail>
            <StyledLocationDetail>
              <StyledLocationDetailLabel>{t('adventureLocation.adventureTime')}</StyledLocationDetailLabel>
              <StyledLocationDetailValue>{formatDuration(location.adventureTime)}</StyledLocationDetailValue>
            </StyledLocationDetail>
            <StyledLocationDetail>
              <StyledLocationDetailLabel>
                {t('adventureLocation.restingTime')} <HelpButton message={t('adventureLocation.restingTimeHelp')} />
              </StyledLocationDetailLabel>
              <StyledLocationDetailValue>{formatDuration(location.restingTime)}</StyledLocationDetailValue>
            </StyledLocationDetail>
          </StyledLocationDetails>

          <StyledRope />

          <StyledTitle>
            <AdventureRibbonText>{t('adventureLocation.rewardSectionTitle')}</AdventureRibbonText>
          </StyledTitle>

          <StyledSection showRope={false}>
            <StyledReward>
              <StyledRewardIcon icon={expImage.src} />
              <StyledRewardValue>+{location.successRewards.exp?.fixed ?? 0} EXP</StyledRewardValue>
            </StyledReward>

            <StyledReward>
              <StyledRewardIcon icon={itemsImage.src} />
              <StyledRewardValue>{itemReward.join('~')} items</StyledRewardValue>
            </StyledReward>

            <StyledReward>
              <StyledRewardIcon icon={tcpImage.src} />
              <StyledRewardValue>+{location.successRewards.tcp?.fixed ?? 0} tcp</StyledRewardValue>
            </StyledReward>
          </StyledSection>
        </>
      )}
    </div>
  )
}
