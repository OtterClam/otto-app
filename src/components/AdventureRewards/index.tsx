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
import Skeleton from 'react-loading-skeleton'

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
  flex-direction: column;
  background: ${({ theme }) => theme.colors.darkGray400};
  color: ${({ theme }) => theme.colors.white};
`

const StyledRewards = styled.div`
  display: flex;
  padding: 0 0 15px 0;

  &:first-child {
    padding-top: 15px;
  }
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

const StyledPotionButton = styled(Note).attrs({ as: 'button' })<{ disabled?: boolean }>`
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

const StyledPotionAmounts = styled(Note).attrs({ as: 'div' })`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 3px;
`

const StyledHeader = styled.div`
  display: flex;
  padding: 7px 7px 0 7px;
`

const StyledPotionAmount = styled.div`
  display: flex;
  align-items: center;
  border-radius: 4px;
  background: ${({ theme }) => theme.colors.otterBlack};
  padding: 0 5px;
`

const StyledRewardsHelp = styled.div`
  flex: 1;
  display: flex;
  justify-content: flex-end;
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
    <StyledPotionButton disabled={!amount} onClick={() => onUse(potion)}>
      <StyledPotionIcon potion={potion} />
      {usedAmount > 0 && t('usedPotion', { amount: usedAmount })}
      {usedAmount === 0 && amount === 0 && t('noPotion')}
      {usedAmount === 0 && amount > 0 && t('usePotion')}
    </StyledPotionButton>
  )
}

export interface AdventureRewardsProps {
  loading?: boolean
  canUsePotions?: boolean
  onUsePotion?: (usedPotionAmounts: { [k: string]: number }) => void
}

export default function AdventureRewards({ loading, canUsePotions, onUsePotion = noop }: AdventureRewardsProps) {
  const { t } = useTranslation('', { keyPrefix: 'adventureLocation' })
  const location = useAdventureLocation()
  const { amounts: potionAmounts } = useAdventurePotion()
  const [usedPotionAmounts, setUsedPotionAmounts] = useState<{ [k: string]: number }>({})
  const applyPotion = useCallback((potion: AdventurePotion) => {
    setUsedPotionAmounts(usedPotionAmounts => ({
      ...usedPotionAmounts,
      [potion]: usedPotionAmounts[potion] === 1 ? 0 : 1,
    }))
  }, [])

  useEffect(() => {
    onUsePotion(usedPotionAmounts)
  }, [usedPotionAmounts, onUsePotion])

  if (!location || loading) {
    return (
      <div>
        <StyledLocationDetails>
          <StyledLocationDetail>
            <StyledLocationDetailLabel>
              {t('successRate')} <HelpButton message={t('successRateHelp')} />
            </StyledLocationDetailLabel>
            <StyledLocationDetailValue>
              <Skeleton width="50px" />
            </StyledLocationDetailValue>
          </StyledLocationDetail>
          <StyledLocationDetail>
            <StyledLocationDetailLabel>{t('adventureTime')}</StyledLocationDetailLabel>
            <StyledLocationDetailValue>
              <Skeleton width="50px" />
            </StyledLocationDetailValue>
          </StyledLocationDetail>
          <StyledLocationDetail>
            <StyledLocationDetailLabel>
              {t('restingTime')} <HelpButton message={t('restingTimeHelp')} />
            </StyledLocationDetailLabel>
            <StyledLocationDetailValue>
              <Skeleton width="50px" />
            </StyledLocationDetailValue>
          </StyledLocationDetail>
        </StyledLocationDetails>

        <StyledRope />

        <StyledTitle>
          <AdventureRibbonText>{t('rewardSectionTitle')}</AdventureRibbonText>
        </StyledTitle>

        <StyledSection showRope={false}>
          <StyledHeader>
            <StyledRewardsHelp>
              <HelpButton message={t('rewardsHelp')} />
            </StyledRewardsHelp>
          </StyledHeader>

          <StyledRewards>
            <StyledReward>
              <StyledRewardIcon icon={expImage.src} />
              <StyledRewardValue>
                <Skeleton width="50px" />
              </StyledRewardValue>
            </StyledReward>

            <StyledReward>
              <StyledRewardIcon icon={itemsImage.src} />
              <StyledRewardValue>
                <Skeleton width="50px" />
              </StyledRewardValue>
            </StyledReward>

            <StyledReward>
              <StyledRewardIcon icon={tcpImage.src} />
              <StyledRewardValue>
                <Skeleton width="50px" />
              </StyledRewardValue>
            </StyledReward>

            <StyledReward>
              <StyledRewardIcon icon={apImage.src} />
              <StyledRewardValue>
                <Skeleton width="50px" />
              </StyledRewardValue>
            </StyledReward>
          </StyledRewards>
        </StyledSection>
      </div>
    )
  }

  return (
    <div>
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
        <StyledHeader>
          {canUsePotions && (
            <StyledPotionAmounts>
              <StyledPotionAmount>
                <StyledPotionIcon potion={AdventurePotion.Exp} />
                {(potionAmounts[AdventurePotion.Exp] ?? 0) - (usedPotionAmounts[AdventurePotion.Exp] ?? 0)}
              </StyledPotionAmount>
              <StyledPotionAmount>
                <StyledPotionIcon potion={AdventurePotion.Str} />
                {(potionAmounts[AdventurePotion.Str] ?? 0) - (usedPotionAmounts[AdventurePotion.Str] ?? 0)}
              </StyledPotionAmount>
            </StyledPotionAmounts>
          )}

          <StyledRewardsHelp>
            <HelpButton message={t('rewardsHelp')} />
          </StyledRewardsHelp>
        </StyledHeader>

        <StyledRewards>
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
            <StyledRewardValue>
              {[location.successRewards?.item.min, location.successRewards?.item.max].join('~')} Items
            </StyledRewardValue>
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
        </StyledRewards>
      </StyledSection>
    </div>
  )
}
