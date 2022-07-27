import { IS_SERVER } from 'constant'
import { useAssetsLoader } from 'contexts/AssetsLoader'
import { useTranslation } from 'next-i18next'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import styled from 'styled-components/macro'
import Loading1 from './loading1.gif'
import Loading2 from './loading2.gif'
import Ottos from './ottos.png'

const StyledContainer = styled.div<{ show: boolean }>`
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji',
    'Segoe UI Emoji', 'Segoe UI Symbol';
  display: ${({ show }) => (show ? 'flex' : 'none')};
  position: fixed;
  z-index: var(--z-index-popup);
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.darkGray400};
`

const StyledImageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
`

const StyledProgress = styled.div`
  display: flex;
  align-items: center;
  width: 240px;
  height: 12px;
  gap: 10px;

  &::after {
    content: attr(data-progress);
    display: block;
    color: ${({ theme }) => theme.colors.white};
    font-size: 16px;
  }
`

const StyledProgressBar = styled.div<{ progress: number }>`
  border-radius: 6px;
  height: 100%;
  background: ${({ theme }) => theme.colors.white};
  max-width: 200px;
  min-width: 200px;

  &::before {
    content: '';
    display: block;
    width: calc(${({ progress }) => progress * 100}% + 6px);
    height: 100%;
    background: ${({ theme }) => theme.colors.otterBlue};
    border-radius: 6px;
  }
`

const StyledLoadingImage = styled.img`
  width: 400px;
  height: 400px;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    width: 256px;
    height: 256px;
  }
`

const StyledOttoContainer = styled.div`
  display: flex;
  position: absolute;
  left: 120px;
  right: 120px;
  bottom: 0;
  align-items: end;
  gap: 12px;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    left: 0px;
    right: 10px;
  }
`

const StyledOtto = styled.div<{ no: number }>`
  background: ${({ no }) => no * -250}px top / 750px 250px url(${Ottos.src});
  min-width: 250px;
  max-width: 250px;
  height: 250px;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    background: ${({ no }) => no * -116}px top / ${116 * 3}px 116px url(${Ottos.src});
    min-width: 116px;
    max-width: 116px;
    height: 116px;
  }
`

const StyledDialogContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 70px;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    margin-bottom: 10px;
  }
`

const StyledDialog = styled.div`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.otterBlack};
  background: ${({ theme }) => theme.colors.white};
  border-radius: 20px;
  border: 4px solid ${({ theme }) => theme.colors.otterBlack};
  padding: 20px;
  max-width: 614px;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    font-size: 14px;
    padding: 10px;
  }
`

const StyledOttoName = styled.div`
  font-size: 16px;
  color: ${({ theme }) => theme.colors.white};
  margin-left: 4px;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    font-size: 14px;
  }
`

function getRandomNumber(min: number, max: number) {
  return Math.round(Math.random() * (max - min) + min)
}

function useLoadingImage(): string {
  const [num] = useState(() => getRandomNumber(0, 1))
  return [Loading1, Loading2][num].src
}

const dialogCounts = [4, 3, 3]

function useOtto() {
  const [ottoNo] = useState(() => getRandomNumber(0, 2))
  const [dialogNo, setDialogNo] = useState(0)

  useEffect(() => {
    const dialogCount = dialogCounts[ottoNo]
    const timer = setInterval(() => {
      setDialogNo(num => (num + 1) % dialogCount)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return { ottoNo, dialogNo }
}

export default function AssetsLoader() {
  const loadingImage = useLoadingImage()
  const { ottoNo, dialogNo } = useOtto()
  const assetsLoader = useAssetsLoader()
  const [progress, setProgress] = useState(1)
  const { t } = useTranslation()

  useEffect(() => {
    assetsLoader.on('progress', setProgress)
    return () => {
      assetsLoader.off('progress', setProgress)
    }
  }, [])

  useEffect(() => {
    if (!IS_SERVER && progress < 1) {
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = ''
      }
    }
  }, [progress])

  if (typeof document === 'undefined') {
    return null
  }

  return createPortal(
    <StyledContainer show={progress < 1}>
      <StyledImageContainer>
        <StyledLoadingImage src={loadingImage} />
        <StyledProgress data-progress={Math.floor(progress * 100) + '%'}>
          <StyledProgressBar progress={progress} />
        </StyledProgress>
      </StyledImageContainer>
      <StyledOttoContainer>
        <StyledOtto no={ottoNo} />
        <StyledDialogContainer>
          <StyledOttoName>{t(`assets_loader.name.${ottoNo}`)}</StyledOttoName>
          <StyledDialog>{t(`assets_loader.messages.${ottoNo}.${dialogNo}`)}</StyledDialog>
        </StyledDialogContainer>
      </StyledOttoContainer>
    </StyledContainer>,
    document.querySelector('#modal-root') as Element
  )
}
