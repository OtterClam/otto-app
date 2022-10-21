import AdventureFullscreen from 'components/AdventureFullscreen'
import styled from 'styled-components/macro'
import RewardRibbonText from 'components/RewardRibbonText'
import { AdventureUIActionType, useAdventureUIState } from 'contexts/AdventureUIState'
import { useTranslation } from 'next-i18next'
import { Caption, Headline } from 'styles/typography'
import Button from 'components/Button'
import { useCallback, useState } from 'react'
import RedeemCouponPopup from 'components/RedeemCouponPopup'
import chestImage from './chest.png'

const StyledFullscreen = styled(AdventureFullscreen)`
  position: relative;
  max-width: 375px !important;
  width: 80% !important;
  background: ${({ theme }) => theme.colors.otterBlack};
  color: ${({ theme }) => theme.colors.white};

  .fullscreen-inner {
    padding: 40px 20px 20px;
  }
`

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`

const StyledPopupTitle = styled(RewardRibbonText)`
  z-index: 1;
`

const StyledDesc = styled(Caption)`
  width: 100%;
  text-align: center;
`

const StyledChest = styled.div`
  width: 235px;
  max-height: 235px;
  min-height: 235px;
  background center / cover url(${chestImage.src});
`

export default function TreasuryChestPopup() {
  const [redeem, setRedeem] = useState(false)
  const { t } = useTranslation('', { keyPrefix: 'treasuryChestPopup' })
  const {
    state: { treasuryChest },
    dispatch,
  } = useAdventureUIState()

  const closeRedeemCouponPopup = useCallback(() => {
    setRedeem(false)
    dispatch({ type: AdventureUIActionType.SetTreasuryChestItem })
  }, [])

  return (
    <>
      <StyledFullscreen
        show={Boolean(treasuryChest)}
        bodyClassName="fullscreen-inner"
        header={<StyledPopupTitle text={t('popupTitle')} />}
      >
        <StyledContainer>
          <StyledDesc>{t('desc')}</StyledDesc>
          <StyledChest />
          <Button width="100%" Typography={Headline} onClick={() => setRedeem(true)}>
            {t('button')}
          </Button>
        </StyledContainer>
      </StyledFullscreen>
      {redeem && treasuryChest && <RedeemCouponPopup coupon={treasuryChest} onClose={closeRedeemCouponPopup} />}
    </>
  )
}
