import Button from 'components/Button'
import Fullscreen from 'components/Fullscreen'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { mintReset, selectMintNumber, selectMintStatus } from 'store/uiSlice'
import styled from 'styled-components/macro'
import { ContentLarge, Display3, Headline } from 'styles/typography'
import LoadingOtter from 'assets/loading-otter.png'
import SuccessPortal from 'assets/success-portal.png'
import { useRouter } from 'next/router'

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
  background-color: ${({ theme }) => theme.colors.otterBlack};
  border-radius: 10px;
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
  const router = useRouter()
  const mintStatus = useSelector(selectMintStatus)
  const mintNumber = useSelector(selectMintNumber)
  return (
    <Fullscreen show={mintStatus !== 'init'}>
      <StyledMintPopup>
        {mintStatus === 'minting' && (
          <>
            <StyledLoadingOtter src={LoadingOtter.src} />
            <StyledLoadingText as="p">{t('mint.popup.processing')}</StyledLoadingText>
          </>
        )}
        {mintStatus === 'success' && (
          <>
            <StyledSuccessPortal src={SuccessPortal.src} />
            <Headline>Clamtastic!</Headline>
            <Display3>{t('mint.popup.success_msg', { mintNumber })}</Display3>
            <Button
              Typography={Headline}
              onClick={() => {
                dispatch(mintReset())
                router.push('/my-portals')
              }}
            >
              {t('mint.popup.view_my_portals')}
            </Button>
          </>
        )}
      </StyledMintPopup>
    </Fullscreen>
  )
}
