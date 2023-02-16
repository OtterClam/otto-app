import CloseIcon from 'assets/ui/close_icon.svg'
import Fullscreen from 'components/Fullscreen'
import { useTranslation } from 'next-i18next'
import styled, { keyframes } from 'styled-components/macro'
import { Display3, Headline } from 'styles/typography'
import Image from 'next/image'
import { trim } from 'helpers/trim'
import Otto from './mine_otto.png'

const StyledMineSuccessPopup = styled.div`
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

const StyledDesc = styled(Headline)`
  > span {
    color: ${({ theme }) => theme.colors.crownYellow};
  }
`

const StyledCloseIcon = styled.button`
  position: absolute;
  top: 44px;
  right: 44px;
`

const Animation = keyframes`
  0%   { background-position: left top }
  50%  { background-position: right top }
`

const StyledOtter = styled.div`
  width: 260px;
  height: 210px;
  animation: ${Animation} 2000ms steps(1) infinite;
  background: left top / 200% 100% url(${Otto.src});
  pointer-events: none;
`

interface Props {
  amount: string
  onClose: () => void
}

export default function MineSuccessPopup({ amount, onClose }: Props) {
  const { t } = useTranslation('', { keyPrefix: 'mine.success_popup' })
  return (
    <Fullscreen width="unset">
      <StyledMineSuccessPopup>
        <StyledHeadline>{t('headline')}</StyledHeadline>
        <StyledTitle>{t('title')}</StyledTitle>
        <StyledOtter />
        <StyledDesc>
          {t('desc')} <span>{trim(amount, 2)}</span> USDC!
        </StyledDesc>
        <StyledCloseIcon onClick={onClose}>
          <Image src={CloseIcon.src} alt="close" width={16} height={16} />
        </StyledCloseIcon>
      </StyledMineSuccessPopup>
    </Fullscreen>
  )
}
