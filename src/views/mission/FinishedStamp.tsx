import { useTranslation } from 'next-i18next'
import styled from 'styled-components/macro'
import { Note } from 'styles/typography'
import FinishedStampWhiteBg from './stamp_finished_white.svg'
import FinishedStampBg from './stamp_finished.svg'

type Color = 'grey' | 'white'

const StyledFinished = styled.div<{ color: Color }>`
  display: flex;
  align-items: center;
  padding-left: 30px;
  color: ${({ theme, color }) => (color === 'white' ? theme.colors.white : theme.colors.darkGray100)};
  width: 97px;
  height: 32px;
  background: no-repeat center/contain
    url(${({ color }) => (color === 'white' ? FinishedStampWhiteBg.src : FinishedStampBg.src)});
  transform: rotate(-10deg);

  span {
    width: 100%;
    text-align: center;
  }
`

interface Props {
  className?: string
  color?: Color
}

export default function FinishedStamp({ className, color = 'grey' }: Props) {
  const { t } = useTranslation('', { keyPrefix: 'mission' })
  return (
    <StyledFinished className={className} color={color}>
      <Note>{t('finished')}</Note>
    </StyledFinished>
  )
}
