import HelpButton from 'components/HelpButton'
import SectionRope from 'components/SectionRope'
import TreasurySection from 'components/TreasurySection'
import { formatDuration } from 'date-fns'
import { useTranslation } from 'next-i18next'
import styled from 'styled-components/macro'
import { ContentExtraSmall, Note } from 'styles/typography'
import tcpImage from 'assets/adventure/reward/tcp.png'
import apImage from 'assets/adventure/reward/ap.png'
import expImage from 'assets/adventure/reward/exp.png'
import itemsImage from 'assets/adventure/reward/items.png'
import AdventureRibbonText from 'components/AdventureRibbonText'
import { useAdventureLocation } from 'contexts/AdventureLocation'
import { BoostTarget } from 'models/AdventureLocation'
import useAdventurePotion from 'hooks/useAdventurePotion'
import { AdventurePotion } from 'constant'
import noop from 'lodash/noop'
import { useCallback, useEffect, useState } from 'react'
import expPotionIcon from 'assets/potions/exp.png'
import strPotionIcon from 'assets/potions/str.png'

const potionIcons: { [k: string]: any } = {
  [AdventurePotion.Exp]: expPotionIcon,
  [AdventurePotion.Str]: strPotionIcon,
}

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

const StyledPotionButton = styled(Note).attrs({ as: 'button' })<{ disabled: boolean }>`
  color: ${({ theme }) => theme.colors.white};
  background: ${({ theme }) => theme.colors.otterBlue};
  border-radius: 4px;
  padding: 0px 5px;
  display: flex;
  align-items: center;
  height: 18px;

  &:disabled {
    color: ${({ theme }) => theme.colors.darkGray200};
    background: ${({ theme }) => theme.colors.otterBlack};
  }
`

const StyledPotionIcon = styled.div<{ potion: AdventurePotion }>`
  width: 16px;
  height: 16px;
  background: center / cover url(${({ potion }) => potionIcons[potion].src});
`

function PotionButton({
  potion,
  potionAmounts,
  usedPotionAmounts,
  onUse,
}: {
  potion: AdventurePotion
  potionAmounts: { [k: string]: number }
  usedPotionAmounts: { [k: string]: number }
  onUse: (potion: AdventurePotion) => void
}) {
  const { t } = useTranslation('', { keyPrefix: 'adventureLocation' })
  const amount = potionAmounts[potion] ?? 0
  const usedAmount = usedPotionAmounts[potion] ?? 0
  return (
    <StyledPotionButton disabled={amount - usedAmount <= 0 || usedAmount === 1} onClick={() => onUse(potion)}>
      <StyledPotionIcon potion={potion} />
      {usedAmount > 0 && t('usedPotion', { amount: usedAmount })}
      {usedAmount === 0 && amount === 0 && t('noPotion')}
      {usedAmount === 0 && amount > 0 && t('usePotion')}
    </StyledPotionButton>
  )
}

export interface AdventureRewardsProps {
  canUsePotions?: boolean
  onUsePotion?: (usedPotionAmounts: { [k: string]: number }) => void
}

export default function AdventureRewards({ canUsePotions, onUsePotion = noop }: AdventureRewardsProps) {
  const { t } = useTranslation('', { keyPrefix: 'adventureLocation' })
  const location = useAdventureLocation()
  const { amounts: potionAmounts } = useAdventurePotion()
  const [usedPotionAmounts, setUsedPotionAmounts] = useState<{ [k: string]: number }>({})
  const applyPotion = useCallback((potion: AdventurePotion) => {
    setUsedPotionAmounts(usedPotionAmounts => ({
      ...usedPotionAmounts,
      [potion]: (usedPotionAmounts[potion] ?? 0) + 1,
    }))
  }, [])
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

  useEffect(() => {
    onUsePotion(usedPotionAmounts)
  }, [usedPotionAmounts])

  return (
    <div>
      {location && (
        <>
          <StyledLocationDetails>
            <StyledLocationDetail>
              <StyledLocationDetailLabel>
                {t('successRate')} <HelpButton message={t('successRateHelp')} />
              </StyledLocationDetailLabel>
              <StyledLocationDetailValue>{location.successRate}%</StyledLocationDetailValue>
            </StyledLocationDetail>
            <StyledLocationDetail>
              <StyledLocationDetailLabel>{t('adventureTime')}</StyledLocationDetailLabel>
              <StyledLocationDetailValue>{formatDuration(location.adventureTime)}</StyledLocationDetailValue>
            </StyledLocationDetail>
            <StyledLocationDetail>
              <StyledLocationDetailLabel>
                {t('restingTime')} <HelpButton message={t('restingTimeHelp')} />
              </StyledLocationDetailLabel>
              <StyledLocationDetailValue>{formatDuration(location.restingTime)}</StyledLocationDetailValue>
            </StyledLocationDetail>
          </StyledLocationDetails>

          <StyledRope />

          <StyledTitle>
            <AdventureRibbonText>{t('rewardSectionTitle')}</AdventureRibbonText>
          </StyledTitle>

          <StyledSection showRope={false}>
            <StyledReward>
              <StyledRewardIcon icon={expImage.src} />
              <StyledRewardValue>+{location.successRewards.exp?.fixed ?? 0} EXP</StyledRewardValue>
              {canUsePotions && (
                <PotionButton
                  potion={AdventurePotion.Exp}
                  potionAmounts={potionAmounts}
                  usedPotionAmounts={usedPotionAmounts}
                  onUse={applyPotion}
                />
              )}
            </StyledReward>

            <StyledReward>
              <StyledRewardIcon icon={itemsImage.src} />
              <StyledRewardValue>{itemReward.join('~')} Items</StyledRewardValue>
              {canUsePotions && (
                <PotionButton
                  potion={AdventurePotion.Str}
                  potionAmounts={potionAmounts}
                  usedPotionAmounts={usedPotionAmounts}
                  onUse={applyPotion}
                />
              )}
            </StyledReward>

            <StyledReward>
              <StyledRewardIcon icon={tcpImage.src} />
              <StyledRewardValue>+{location.successRewards.tcp?.fixed ?? 0} TCP</StyledRewardValue>
            </StyledReward>

            <StyledReward>
              <StyledRewardIcon icon={apImage.src} />
              <StyledRewardValue>+{location.successRewards.ap?.fixed ?? 0} AP</StyledRewardValue>
            </StyledReward>
          </StyledSection>
        </>
      )}
    </div>
  )
}
