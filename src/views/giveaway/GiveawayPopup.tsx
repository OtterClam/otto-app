import LoadingOtter from 'assets/loading-otter.png'
import Star from 'assets/ui/large-star.svg'
import Button from 'components/Button'
import Link from 'next/link'
import Fullscreen from 'components/Fullscreen'
import { useTranslation } from 'next-i18next'
import styled, { keyframes } from 'styled-components/macro'
import { ContentLarge, Headline } from 'styles/typography'

const StyledGiveawayPopup = styled.div`
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

const StyledLoadingText = styled(ContentLarge).attrs({ as: 'p' })``

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
  flex: 1;
  position: relative;
  pointer-events: none;

  img {
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

const StyledSuccessMessage = styled(Headline).attrs({ as: 'h1' })`
  white-space: pre;
`

interface Props {
  status: 'loading' | 'success'
}

export default function GiveawayPopup({ status }: Props) {
  const { t } = useTranslation('', { keyPrefix: 'giveaway.popup' })
  return (
    <Fullscreen>
      <StyledGiveawayPopup>
        {status === 'loading' && (
          <>
            <StyledLoadingOtter src={LoadingOtter.src} />
            <StyledLoadingText>{t('processing')}</StyledLoadingText>
          </>
        )}
        {status === 'success' && (
          <>
            <StyledSuccessMessage>{t('success_msg')}</StyledSuccessMessage>
            <StyledImageContainer>
              {Array(7)
                .fill(0)
                .map((_, i) => (
                  <StyledImg key={i} src={`/chest-loadings/silver-loading-${i + 1}.png`} delay={i * 150} />
                ))}
              <StyledStableImg src="/chest-loadings/silver-loading-8.png" />
            </StyledImageContainer>
            <Link href="/my-items" style={{ zIndex: 1 }}>
              <a>
                <Button Typography={Headline}>{t('checkout_link')}</Button>
              </a>
            </Link>
          </>
        )}
      </StyledGiveawayPopup>
    </Fullscreen>
  )
}
