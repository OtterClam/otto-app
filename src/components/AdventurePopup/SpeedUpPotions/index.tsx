import { AdventurePotion } from 'constant'
import useAdventurePotion from 'hooks/useAdventurePotion'
import { useEffect, useState } from 'react'
import styled from 'styled-components/macro'
import SpeedPotion from './speed-up-potion.png'
import SpeedUpPotion from './SpeedUpPotion'

const StyledSpeedUpPotions = styled.div`
  display: flex;
  gap: 30px;
`

interface Props {
  disabled: boolean
  onUsedPotionsUpdate: (numbers: number[]) => void
}

export default function SpeedUpPotions({ disabled, onUsedPotionsUpdate }: Props) {
  const [usedPotionAmounts, setUsedPotionAmounts] = useState<{ [k: string]: number }>({})
  const { amounts } = useAdventurePotion()
  useEffect(() => {
    const usedPotions = Object.keys(usedPotionAmounts)
      .map(key => {
        const amount = usedPotionAmounts[key]
        const idList: number[] = []
        for (let i = 0; i < amount; i += 1) {
          idList.push(Number(key))
        }
        return idList
      })
      .reduce((all, list) => all.concat(list), [] as number[])
    onUsedPotionsUpdate(usedPotions)
  }, [usedPotionAmounts, onUsedPotionsUpdate])
  return (
    <StyledSpeedUpPotions>
      <SpeedUpPotion
        disabled={disabled}
        potion={AdventurePotion.OneHourSpeedy}
        onChanged={setUsedPotionAmounts}
        image={SpeedPotion.src}
        amounts={amounts}
        usedAmounts={usedPotionAmounts}
        reducedTime="1h"
      />
      <SpeedUpPotion
        disabled={disabled}
        potion={AdventurePotion.ThreeHourSpeedy}
        onChanged={setUsedPotionAmounts}
        image={SpeedPotion.src}
        amounts={amounts}
        usedAmounts={usedPotionAmounts}
        reducedTime="3h"
      />
      <SpeedUpPotion
        disabled={disabled}
        potion={AdventurePotion.SixHourSpeedy}
        onChanged={setUsedPotionAmounts}
        image={SpeedPotion.src}
        amounts={amounts}
        usedAmounts={usedPotionAmounts}
        reducedTime="6h"
      />
    </StyledSpeedUpPotions>
  )
}