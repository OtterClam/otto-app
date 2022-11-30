import intervalToDuration from 'date-fns/intervalToDuration'
import { I18n } from 'next-i18next'
import { formatDuration } from 'utils/duration'
import zodiacImage from 'assets/adventure/boost/zodiac.png'
import birthImage from 'assets/adventure/boost/birth.png'
import legendaryImage from 'assets/adventure/boost/legendary.png'
import expImage from 'assets/adventure/boost/exp.png'
import {
  AdventureLocationConditionalBoost,
  AttrBoostCondition,
  BoostAmounts,
  BoostConditionType,
  BoostTarget,
  BoostType,
} from './AdventureLocation'
import Otto from './Otto'

const icons = {
  [BoostType.Birthday]: birthImage.src,
  [BoostType.Zodiac]: zodiacImage.src,
  [BoostType.Legendary]: legendaryImage.src,
  [BoostType.Exp]: expImage.src,
  [BoostType.LevelUp]: '',
}

const effectiveUntilMessage = (i18n: I18n, boost: AdventureLocationConditionalBoost): string => {
  const now = new Date()
  return boost.effective && boost.effectiveUntil
    ? i18n.t('conditionalBoosts.effectiveUntil', {
        duration: formatDuration(intervalToDuration({ start: now, end: boost.effectiveUntil })),
      })
    : ''
}

export type AdventureDisplayedBoost =
  | {
      boostType: BoostType.Birthday | BoostType.Legendary | BoostType.LevelUp | BoostType.Zodiac
      message: string
      effective: boolean
      icon: string
    }
  | {
      boostType: BoostType.FirstMatchGroup
      message: string
      effective: boolean
      attr: string
      boosts: AdventureLocationConditionalBoost[]
      currentLevelEffectiveBoosts: string[]
    }
  | {
      boostType: BoostType.Exp
      message: string
      effective: boolean
      icon: string
      currentLevelEffectiveBoosts: string[]
    }

export const parseBoosts = (
  i18n: I18n,
  otto: Otto | undefined,
  boosts: AdventureLocationConditionalBoost[],
  details = false
): AdventureDisplayedBoost[] => {
  const queue = boosts.slice()
  const displayedBoosts: AdventureDisplayedBoost[] = []
  let fixedLevelBoost: (AdventureDisplayedBoost & { currentLevelEffectiveBoosts: string[] }) | undefined
  let levelUpBoost: AdventureDisplayedBoost | undefined

  while (queue.length > 0) {
    const displayedBoost =
      parseLevelUpBoosts(i18n, queue) ||
      parseFirstMatchGroup(i18n, otto, queue, details) ||
      parseOtherBoost(i18n, queue)
    if (displayedBoost) {
      if (displayedBoost.boostType === BoostType.FirstMatchGroup && displayedBoost.attr === 'level') {
        fixedLevelBoost = displayedBoost
      } else if (displayedBoost.boostType === BoostType.LevelUp) {
        levelUpBoost = displayedBoost
      } else {
        displayedBoosts.push(displayedBoost)
      }
    }
  }

  if (levelUpBoost || fixedLevelBoost) {
    displayedBoosts.push({
      boostType: BoostType.Exp,
      message: [levelUpBoost?.message, fixedLevelBoost?.message].filter(Boolean).join('<br />'),
      effective: levelUpBoost?.effective || fixedLevelBoost?.effective || false,
      icon: icons.exp,
      currentLevelEffectiveBoosts: [levelUpBoost?.message]
        .concat(fixedLevelBoost?.currentLevelEffectiveBoosts ?? [])
        .filter(Boolean) as string[],
    })
  }

  return displayedBoosts
}

const stringifyBoostAmounts = (i18n: I18n, amounts: BoostAmounts): string => {
  const displayedAmounts: BoostAmounts = { ...amounts }
  const artwork = displayedAmounts[BoostTarget.AdditionalArtwork]
  const item = displayedAmounts[BoostTarget.AdditionalItem]
  delete displayedAmounts[BoostTarget.AdditionalArtwork]

  if (item && artwork) {
    item.value += artwork.value
  }

  return Object.keys(displayedAmounts)
    .map(target =>
      i18n.t(`adventureBoostTarget.${target}`, {
        amount: amounts[target].value,
        percentage: amounts[target].percentage >= 100 ? '' : `${amounts[target].percentage}%`,
      })
    )
    .join(' | ')
}

const parseOtherBoost = (
  i18n: I18n,
  boosts: AdventureLocationConditionalBoost[]
): AdventureDisplayedBoost | undefined => {
  const boost = boosts.shift()
  if (!boost) {
    return undefined
  }

  if (boost.type === BoostType.FirstMatchGroup || boost.type === BoostType.Exp) {
    return undefined
  }

  return {
    boostType: boost.type,
    message: [
      i18n?.t(`conditionalBoosts.${boost.type}`),
      stringifyBoostAmounts(i18n, boost.amounts),
      effectiveUntilMessage(i18n, boost),
    ]
      .filter(Boolean)
      .join(' '),
    effective: boost.effective,
    icon: icons[boost.type],
  }
}

const parseLevelUpBoosts = (
  i18n: I18n,
  boosts: AdventureLocationConditionalBoost[]
): AdventureDisplayedBoost | undefined => {
  let effectiveBoost: AdventureLocationConditionalBoost | undefined
  let boost: AdventureLocationConditionalBoost

  while (boosts[0]?.type === BoostType.LevelUp) {
    boost = boosts.shift()!
    if (boost.effective) {
      effectiveBoost = boost
    }
  }

  if (!effectiveBoost) {
    return
  }

  return {
    boostType: BoostType.LevelUp,
    message: [
      i18n.t(`conditionalBoosts.${BoostType.LevelUp}`),
      stringifyBoostAmounts(i18n, effectiveBoost.amounts),
      effectiveUntilMessage(i18n, effectiveBoost),
    ]
      .filter(Boolean)
      .join(' '),
    effective: true,
    icon: '',
  }
}

const parseFirstMatchGroup = (
  i18n: I18n,
  otto: Otto | undefined,
  boosts: AdventureLocationConditionalBoost[],
  details = false
): AdventureDisplayedBoost | undefined => {
  const group: AdventureLocationConditionalBoost[] = []
  let effectiveBoost: AdventureLocationConditionalBoost | undefined
  let firstMatchedBoost: AdventureLocationConditionalBoost | undefined
  let boost: AdventureLocationConditionalBoost

  while (boosts[0]?.type === BoostType.FirstMatchGroup) {
    if (!firstMatchedBoost) {
      ;[firstMatchedBoost] = boosts
    }

    if (boosts[0].condition?.type !== BoostConditionType.Base) {
      break
    }

    const firstMatchCondition = firstMatchedBoost.condition as AttrBoostCondition
    const currentCondition = boosts[0].condition as AttrBoostCondition

    if (firstMatchCondition.attr !== currentCondition.attr) {
      break
    }

    boost = boosts.shift()!

    group.push(boost)

    if (boost.effective) {
      effectiveBoost = boost
    }
  }

  if (!firstMatchedBoost) {
    return undefined
  }

  const condition = firstMatchedBoost.condition as AttrBoostCondition

  const stringifyBoost = (boost: AdventureLocationConditionalBoost) => {
    const condition = boost.condition as AttrBoostCondition
    const { amounts } = boost
    const i18nKey =
      condition.attr === 'level' ? 'conditionalBoosts.fixed_level' : `conditionalBoosts.${BoostType.FirstMatchGroup}`
    return [`${i18n.t(i18nKey, condition)} ${stringifyBoostAmounts(i18n, amounts)}`, effectiveUntilMessage(i18n, boost)]
      .filter(Boolean)
      .join(' ')
  }

  return {
    boostType: BoostType.FirstMatchGroup,
    message: details
      ? group.map(stringifyBoost).join('<br />')
      : stringifyBoost(effectiveBoost ?? group[group.length - 1]),
    effective: Boolean(effectiveBoost),
    attr: condition.attr,
    boosts: group,
    currentLevelEffectiveBoosts:
      condition.attr === 'level'
        ? group
            .filter(boost => {
              if (!boost.effective || !otto) {
                return false
              }
              const condition = boost.condition as AttrBoostCondition
              if (condition.operator === '>') {
                return otto.level >= condition.value
              }
              return false
            })
            .map(stringifyBoost)
        : [],
  }
}
