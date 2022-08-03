import IconButton from 'components/IconButton'
import { useBreakpoints } from 'contexts/Breakpoints'
import Link from 'next/link'
import styled from 'styled-components/macro'
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
`

export default function GameMenu({ className }: { className?: string }) {
  const { isMobile } = useBreakpoints()
  const width = isMobile ? 65 : 75

  return (
    <StyledContainer className={className}>
      <StyledItems>
        {items.map(item => (
          <Link href={item.link} key={item.key} passHref>
            <IconButton as="a" icon={item.image} scale={width / item.image.width} />
          </Link>
        ))}
      </StyledItems>
    </StyledContainer>
  )
}
