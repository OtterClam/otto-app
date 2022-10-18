import { AdventurePotion, AdventureSpeedUpTime } from 'constant'

export const calcRemainingTime = (targetDate: Date, potions: AdventurePotion[]) => {
  const time = potions.map(potion => AdventureSpeedUpTime[potion] ?? 0).reduce((total, time) => total + time, 0)
  return new Date(targetDate.getTime() - time)
}
