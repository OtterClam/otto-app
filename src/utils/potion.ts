import { AdventurePotion, AdventureSpeedUpTime } from 'constant'

export const calcRemainingTime = (targetDate: Date | undefined, potions: AdventurePotion[]) => {
  const time = potions.map(potion => AdventureSpeedUpTime[potion] ?? 0).reduce((total, time) => total + time, 0)
  return new Date((targetDate ?? new Date()).getTime() - time)
}
