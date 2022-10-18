import AdventureFullscreen from 'components/AdventureFullscreen'
import { AdventureUIActionType, useAdventureUIState } from 'contexts/AdventureUIState'
import Otto from 'models/Otto'
import { useCallback, useState } from 'react'
import styled from 'styled-components/macro'
import PointsView from './PointsView'
import ResultView from './ResultView'

const StyledFullscreen = styled(AdventureFullscreen)`
  position: relative;
  max-width: 375px !important;
  width: 80% !important;
  background: ${({ theme }) => theme.colors.otterBlack};
  color: ${({ theme }) => theme.colors.white};

  .fullscreen-inner {
    padding: 20px;
  }
`

export default function AttributePoinsPopup() {
  const {
    state: { attributePoints },
    dispatch,
  } = useAdventureUIState()
  const [result, setResult] = useState<{ otto: Otto; points: { [k: string]: number } } | undefined>()

  const closePopup = useCallback(() => {
    dispatch({ type: AdventureUIActionType.DistributeAttributePoints })
  }, [])

  return (
    <StyledFullscreen onRequestClose={closePopup} show={Boolean(attributePoints)} bodyClassName="fullscreen-inner">
      {!result && <PointsView onSuccess={setResult} onRequestClose={closePopup} />}
      {result && <ResultView result={result} newLevel={attributePoints?.newLevel} onRequestClose={closePopup} />}
    </StyledFullscreen>
  )
}
