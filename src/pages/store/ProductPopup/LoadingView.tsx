import Fullscreen from 'components/Fullscreen'
import { useTranslation } from 'react-i18next'
import styled, { keyframes, useTheme } from 'styled-components/macro'
import { ContentLarge } from 'styles/typography'
import Star from './large-star.svg'

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
    background: url(${Star}) no-repeat;
    background-size: 100% 100%;
    top: calc(40% - 454px);
    left: calc(50% - 454px);
    animation: ${Spin} 12s linear infinite;
  }
`

const StyledProcessing = styled(ContentLarge)`
  margin: 0 60px;
  white-space: pre-wrap;
  text-align: center;
`

interface Props {
  image: string
}

export default function LoadingView({ image }: Props) {
  const { t } = useTranslation()
  const theme = useTheme()
  return (
    <Fullscreen background={theme.colors.otterBlack}>
      <StyledLoadingView>
        <StyledImageContainer>
          <img src={image} alt="loading" />
        </StyledImageContainer>
        <StyledProcessing as="p">{t('store.popup.processing')}</StyledProcessing>
      </StyledLoadingView>
    </Fullscreen>
  )
}
