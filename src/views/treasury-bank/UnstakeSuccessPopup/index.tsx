import CloseIcon from 'assets/ui/close_icon.svg'
import Fullscreen from 'components/Fullscreen'
import { useTranslation } from 'next-i18next'
import styled from 'styled-components/macro'
import { Display3, Headline } from 'styles/typography'
import Image from 'next/image'
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
  clamAmount: string
  onClose: () => void
}

export default function UnstakeSuccessPopup({ clamAmount, onClose }: Props) {
  const { t } = useTranslation('', { keyPrefix: 'bank.unstake_popup' })
  return (
    <Fullscreen width="unset">
      <StyledUnstakeSuccessPopup>
        <StyledHeadline>{t('headline')}</StyledHeadline>
        <StyledTitle>{t('title')}</StyledTitle>
        <StyledGif />
        <StyledDesc>
          {t('desc')} <span>{clamAmount}</span> CLAM!
        </StyledDesc>
        <StyledCloseIcon onClick={onClose}>
          <Image src={CloseIcon.src} alt="close" width="24" height="24" />
        </StyledCloseIcon>
      </StyledUnstakeSuccessPopup>
    </Fullscreen>
  )
}
