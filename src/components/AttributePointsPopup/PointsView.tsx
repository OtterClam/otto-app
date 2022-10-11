import Button from 'components/Button'
import CroppedImage from 'components/CroppedImage'
import { useAdventureOtto } from 'contexts/AdventureOttos'
import { useOtto } from 'contexts/Otto'
import { useCallback, useMemo, useState } from 'react'
import styled from 'styled-components/macro'
import { Caption, ContentLarge, Headline, Note } from 'styles/typography'
import PointInput from './PointInput'

const StyeldTitle = styled(ContentLarge)``

const StyledOttoCard = styled.div``

const StyledName = styled(Caption)``

const StyledDetails = styled.div``

const StyledAdventureTitle = styled(Note)``

const StyledExp = styled(Note)``

const StyledAvailablePoints = styled(ContentLarge)``

const StyledPoints = styled.div``

const StyledDesc = styled(Note)``

const attrs = ['str', 'def', 'dex', 'int', 'luk', 'con', 'cute']

export default function PointsView() {
  const { otto } = useOtto()
  const [points, setPoints] = useState<{ [k: string]: number }>({
    str: 0,
    def: 0,
    dex: 0,
    int: 0,
    luk: 0,
    con: 0,
    cute: 0,
  })

  const pointList = useMemo(() => {
    return attrs.map(attr => points[attr])
  }, [points])

  const usedPoints = pointList.reduce((total, points) => total + points, 0)

  const adventureOtto = useAdventureOtto(otto?.tokenId)

  const availablePoints = 2

  const attrValues = useMemo(() => {
    return (otto?.displayAttrs ?? []).reduce(
      (values, attr) => Object.assign(values, { [attr.trait_type]: Number(attr.value) }),
      {} as { [k: string]: number }
    )
  }, [otto])

  const handleChange = useCallback(
    (attr: string, newPoints: number) => {
      setPoints(points => ({
        ...points,
        [attr]: newPoints - attrValues[attr],
      }))
    },
    [otto]
  )

  return (
    <div>
      {otto && adventureOtto && (
        <>
          <StyeldTitle>Add Attribute Points</StyeldTitle>
          <StyledOttoCard>
            <CroppedImage src={adventureOtto.image} />
            <StyledDetails />
          </StyledOttoCard>
          <StyledAvailablePoints>Available: 2 points</StyledAvailablePoints>
          <StyledPoints>
            {attrs.map(attr => (
              <PointInput
                key={attr}
                attr={attr}
                availablePoints={availablePoints - usedPoints}
                currentPoints={attrValues[attr]}
                onChange={handleChange}
              />
            ))}
          </StyledPoints>
          <Button disabled={usedPoints > availablePoints} Typography={Headline}>
            Confirm
          </Button>
          <Button Typography={Headline}>Skip for Now</Button>
          <StyledDesc>You can add attribute points later in My Otto page.</StyledDesc>
        </>
      )}
    </div>
  )
}
