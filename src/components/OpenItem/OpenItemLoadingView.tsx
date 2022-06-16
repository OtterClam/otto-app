import Fullscreen from 'components/Fullscreen'
import { useTranslation } from 'react-i18next'
import styled, { keyframes, useTheme } from 'styled-components/macro'
import { ContentLarge } from 'styles/typography'
import Star from 'assets/ui/large-star.svg'

const StyledLoadingView = styled.div`
  height: calc(80vh);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  color: ${({ theme }) => theme.colors.white};
  overflow: hidden;
`

const Spin = keyframes`
	from{transform:rotate(0deg)}
	to{transform:rotate(360deg)}
`

const GifProcessing = keyframes`
  0%   {opacity: 1;}
  7%  {opacity: 1;}
  14%  {opacity: 0;}
  100% {opacity: 0;}
`

const Stable = keyframes`
  0%   {opacity: 0;}
  32.5%  {opacity: 0;}
  37.5%  {opacity: 1;}
  100% {opacity: 1;}
`

const StyledImageContainer = styled.div`
  flex:1
  position: relative;

  > img {
    position: absolute;
    width: 260px;
    height: 260px;
    top: calc(40% - 130px);
    left: calc(50% - 130px);
  }

  &:before {
    content: ' ';
    position: absolute;
    width: 908px;
    height: 908px;
    background: url(${Star.src}) no-repeat;
    background-size: 100% 100%;
    top: calc(40% - 454px);
    left: calc(50% - 454px);
    animation: ${Spin} 12s linear infinite;
  }
`

const StyledImg = styled.img<{ delay: number }>`
  animation: ${GifProcessing} 3.2s infinite;
  animation-delay: ${({ delay }) => delay}ms;
`

const StyledStableImg = styled.img`
  animation: ${Stable} 3.2s infinite;
`

const StyledProcessing = styled(ContentLarge)`
  margin: 0 60px;
  white-space: pre-wrap;
  text-align: center;
`

interface Props {
  type: string
}

export default function OpenItemLoadingView({ type }: Props) {
  const { t } = useTranslation()
  const theme = useTheme()
  return (
    <Fullscreen background={theme.colors.otterBlack}>
      <StyledLoadingView>
        <StyledImageContainer>
          {Array(7)
            .fill(0)
            .map((_, i) => (
              <StyledImg key={i} src={`/chest-loadings/${type}-loading-${i + 1}.png`} delay={i * 150} />
            ))}
          <StyledStableImg src={`/chest-loadings/${type}-loading-8.png`} />
        </StyledImageContainer>
        <StyledProcessing as="p">{t('store.popup.processing')}</StyledProcessing>
      </StyledLoadingView>
    </Fullscreen>
  )
}
