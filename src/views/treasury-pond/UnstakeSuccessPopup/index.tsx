import CloseIcon from 'assets/ui/close_icon.svg'
import Fullscreen from 'components/Fullscreen'
import { ClamPondToken } from 'contracts/functions'
import { useTranslation } from 'next-i18next'
import Image from 'next/image'
import styled from 'styled-components/macro'
import { Display3, Headline } from 'styles/typography'
import Gif from './unstake.gif'

const StyledUnstakeSuccessPopup = styled.div`
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
  position: relative;
  overflow: hidden;
`

const StyledHeadline = styled(Headline).attrs({ as: 'h2' })``

const StyledTitle = styled(Display3)``

const StyledGif = styled.img.attrs({ src: Gif.src })`
  width: 200px;
  position: relative;
`

const StyledDesc = styled(Headline)`
  > span {
    color: ${({ theme }) => theme.colors.clamPink};
  }
`

const StyledCloseIcon = styled.button`
  position: absolute;
  top: 44px;
  right: 44px;
`

interface Props {
  token: ClamPondToken
  amount: string
  onClose: () => void
}

export default function UnstakeSuccessPopup({ token, amount, onClose }: Props) {
  const { t } = useTranslation('', { keyPrefix: 'stake.unstake_popup' })
  return (
    <Fullscreen width="unset">
      <StyledUnstakeSuccessPopup>
        <StyledHeadline>{t('headline')}</StyledHeadline>
        <StyledTitle>{t('title')}</StyledTitle>
        <StyledGif />
        <StyledDesc>
          {t('desc')} <span>{amount}</span> {token}!
        </StyledDesc>
        <StyledCloseIcon onClick={onClose}>
          <Image src={CloseIcon} alt="close" />
        </StyledCloseIcon>
      </StyledUnstakeSuccessPopup>
    </Fullscreen>
  )
}
