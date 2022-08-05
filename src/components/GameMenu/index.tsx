import ImageButton from 'components/ImageButton'
import NotificationBadge from 'components/NotificationBadge'
import { useBreakpoints } from 'contexts/Breakpoints'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import styled from 'styled-components/macro'
import { Caption } from 'styles/typography'
import { textStroke } from 'utils/styles'
import { items } from './items'

const StyledContainer = styled.div`
  position: relative;
  z-index: 0;

  &::before {
    content: '';
    position: absolute;
    z-index: -2;
    left: 0;
    bottom: 0;
    height: 40px;
    width: 100%;
    background: linear-gradient(180deg, #63442e -57.5%, #372110 100%);
    box-sizing: border-box;
    border: 1px ${({ theme }) => theme.colors.otterBlack} solid;
  }

  &::after {
    content: '';
    position: absolute;
    z-index: -1;
    left: 0;
    bottom: 35px;
    height: 5px;
    width: 100%;
    background: rgb(234, 165, 32);
    box-sizing: border-box;
    border: 1px ${({ theme }) => theme.colors.otterBlack} solid;
  }
`

const StyledItems = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-bottom: 10px;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    gap: 5px;
  }
`

const StyledItem = styled(NotificationBadge)`
  &::before {
    right: 1px;
    top: 1px;
  }
`

const StyledLabel = styled(Caption)`
  position: absolute;
  text-align: center;
  bottom: -2px;
  left: 0;
  right: 0;
  color: ${({ theme }) => theme.colors.white};
  ${({ theme }) => textStroke(1, theme.colors.otterBlack)}
`

const itemStates = ['default', 'hover']

export default function GameMenu({ className }: { className?: string }) {
  const { isMobile } = useBreakpoints()
  const width = isMobile ? 65 : 72
  const { t } = useTranslation('', { keyPrefix: 'gameMenu' })

  return (
    <StyledContainer className={className}>
      <StyledItems>
        {items.map(item => (
          <StyledItem show={item.key === 'missions'}>
            <Link href={item.link} key={item.key} passHref>
              <ImageButton
                as="a"
                states={itemStates}
                image={item.image}
                scale={width / (item.image.width / itemStates.length)}
              >
                <StyledLabel>{t(item.key)}</StyledLabel>
              </ImageButton>
            </Link>
          </StyledItem>
        ))}
      </StyledItems>
    </StyledContainer>
  )
}
