import AdventureProgressBar from 'components/AdventureProgressBar'
import Button from 'components/Button'
import CroppedImage from 'components/CroppedImage'
import { useAdventureUIState } from 'contexts/AdventureUIState'
import { useOtto } from 'contexts/Otto'
import { useUseAttributePoints } from 'contracts/functions'
import { useAttributePoints } from 'contracts/views'
import Otto from 'models/Otto'
import { useMyOtto } from 'MyOttosProvider'
import { useTranslation } from 'next-i18next'
import { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components/macro'
import { Caption, ContentExtraSmall, ContentLarge, Headline, Note } from 'styles/typography'
import PointInput from './PointInput'

const StyedContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

const StyledTitle = styled(ContentLarge).attrs({ as: 'h3' })`
  text-align: center;
  margin-bottom: 10px;
`

const StyledOttoCard = styled.div`
  display: flex;
  gap: 10px;
`

const StyledDetails = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 5px;
`

const StyledName = styled(Caption)``

const StyledExp = styled(Note)`
  display: flex;
  justify-content: space-between;
`

const StyledAdventureTitle = styled(Note)``

const StyledExpValue = styled.div``

const StyledAvailablePoints = styled(ContentExtraSmall)`
  text-align: center;
`

const StyledPoints = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

const StyledDesc = styled(Note)`
  text-align: center;
`

const attrs = ['str', 'def', 'dex', 'int', 'luk', 'con', 'cute']

export interface PointsViewProps {
  onSuccess: (result: { otto: Otto; points: { [k: string]: number } }) => void
  onRequestClose: () => void
}

export default function PointsView({ onSuccess, onRequestClose }: PointsViewProps) {
  const { t } = useTranslation('', { keyPrefix: 'attributePoints' })
  const {
    state: { attributePoints },
  } = useAdventureUIState()
  const { useAttributePoints: applyAttributePoints, useAttributePointsState } = useUseAttributePoints()
  const ottoId = attributePoints?.ottoId
  const availablePoints = useAttributePoints(ottoId)

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
  const otto = useMyOtto(ottoId)
  const attrValues = useMemo(() => {
    return (otto?.displayAttrs ?? []).reduce(
      (values, attr) => Object.assign(values, { [attr.trait_type.toLocaleLowerCase()]: Number(attr.value) }),
      {} as { [k: string]: number }
    )
  }, [otto])

  const handleChange = useCallback(
    (attr: string, diff: number) => {
      setPoints(points => ({
        ...points,
        [attr]: points[attr] + diff,
      }))
    },
    [otto]
  )

  const handleConfirm = () => {
    if (!ottoId) {
      return
    }
    applyAttributePoints(ottoId, pointList)
  }

  useEffect(() => {
    if (!otto) {
      return
    }
    if (useAttributePointsState.status === 'Fail' || useAttributePointsState.status === 'Exception') {
      alert(useAttributePointsState.errorMessage ?? '')
    } else if (useAttributePointsState.status === 'Success') {
      onSuccess({ otto, points })
    }
  }, [useAttributePointsState.status])

  return (
    <StyedContainer>
      {otto && otto && (
        <>
          <StyledTitle>{t('popupTitle')}</StyledTitle>
          <StyledOttoCard>
            <CroppedImage src={otto.image} width={60} height={60} />
            <StyledDetails>
              <StyledName>{otto.name}</StyledName>
              <StyledExp>
                <StyledAdventureTitle>
                  LV.{otto.level} {otto.adventurerTitle}
                </StyledAdventureTitle>
                <StyledExpValue>
                  {otto.exp}/{otto.next_level_exp} EXP
                </StyledExpValue>
              </StyledExp>
              <AdventureProgressBar progress={otto.exp / otto.next_level_exp} />
            </StyledDetails>
          </StyledOttoCard>
          <StyledAvailablePoints>
            {t('availablePoints', { points: availablePoints - usedPoints })}
          </StyledAvailablePoints>
          <StyledPoints>
            {attrs.map(attr => (
              <PointInput
                disabled={useAttributePointsState.status === 'Mining'}
                key={attr}
                attr={attr}
                availablePoints={availablePoints - usedPoints}
                currentPoints={attrValues[attr] ?? 0}
                updatedPoints={(attrValues[attr] ?? 0) + points[attr]}
                onChange={handleChange}
              />
            ))}
          </StyledPoints>
          <Button
            disabled={!usedPoints}
            loading={useAttributePointsState.status === 'Mining'}
            Typography={Headline}
            onClick={handleConfirm}
          >
            {t('confirmButton')}
          </Button>
          <Button disabled={useAttributePointsState.status === 'Mining'} Typography={Headline} onClick={onRequestClose}>
            {t('skipButton')}
          </Button>
          <StyledDesc>{t('desc')}</StyledDesc>
        </>
      )}
    </StyedContainer>
  )
}
