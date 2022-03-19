import Fullscreen from 'components/Fullscreen'
import { useSelector } from 'react-redux'
import { selectMintNumber, selectMintStatus } from 'store/uiSlice'
import styled from 'styled-components'
import { ContentLarge, ContentMedium, Display3, Headline } from 'styles/typography'
import LoadingOtter from './loading-otter.png'
import SuccessPortal from './success-portal.png'

const StyledMintPopup = styled.div`
  min-height: 90vh;
  padding: 45px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 10px;
  color: white;
`

const StyledLoadingOtter = styled.img`
  width: 142px;
  height: 127px;
`

const StyledLoadingText = styled(ContentLarge)``

const StyledSuccessPortal = styled.img`
  width: 545px;
  height: 545px;
`

export default function MintPopup() {
  const mintStatus = useSelector(selectMintStatus)
  const mintNumber = useSelector(selectMintNumber)
  return (
    <Fullscreen show={mintStatus !== 'init'}>
      <StyledMintPopup>
        {mintStatus === 'minting' && (
          <>
            <StyledLoadingOtter src={LoadingOtter} />
            <StyledLoadingText as="p">
              Processing... Please do not close the window. The transaction will be finished soon.
            </StyledLoadingText>
          </>
        )}
        {mintStatus === 'success' && (
          <>
            <StyledSuccessPortal src={SuccessPortal} />
            <Headline>Clamtastic!</Headline>
            <Display3>You just purchased {mintNumber} Otto Portal(s)</Display3>
            <ContentMedium>
              Your Otto Portal(s) are now preparing to initiate. Close to check out the remaining preparation time.
            </ContentMedium>
          </>
        )}
      </StyledMintPopup>
    </Fullscreen>
  )
}
