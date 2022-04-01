import { useEthers } from '@usedapp/core'
import Button from 'components/Button'
import Fullscreen from 'components/Fullscreen'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { mintReset, selectMintNumber, selectMintStatus } from 'store/uiSlice'
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
  width: 360px;
`

export default function MintPopup() {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const mintStatus = useSelector(selectMintStatus)
  const mintNumber = useSelector(selectMintNumber)
  return (
    <Fullscreen show={mintStatus !== 'init'}>
      <StyledMintPopup>
        {mintStatus === 'minting' && (
          <>
            <StyledLoadingOtter src={LoadingOtter} />
            <StyledLoadingText as="p">{t('mint.popup.processing')}</StyledLoadingText>
          </>
        )}
        {mintStatus === 'success' && (
          <>
            <StyledSuccessPortal src={SuccessPortal} />
            <Headline>Clamtastic!</Headline>
            <Display3>{t('mint.popup.success_msg', { mintNumber })}</Display3>
            <Button
              click={() => {
                dispatch(mintReset())
                navigate('/my-portals')
              }}
            >
              <Headline>{t('mint.popup.view_my_portals')}</Headline>
            </Button>
          </>
        )}
      </StyledMintPopup>
    </Fullscreen>
  )
}
