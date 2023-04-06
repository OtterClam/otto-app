import Image from 'next/image'
import styled from 'styled-components/macro'

const StyledContainer = styled.div<{ size?: number }>`
  position: relative;
  display: inline-block;

  ${({ size }) =>
    size &&
    `
    width: ${size}px;
  `}

  &::before {
    content: '';
    display: block;
    padding-bottom: 100%;
  }
`

const loadingImage = '/otto-loading.jpg'

const StyledImage = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background: center / cover url(${loadingImage});
`

export interface OttoImageProps {
  src?: string
  unoptimized?: boolean
  size?: number
  imageSize?: number
  className?: string
}

export default function OttoImage({
  src,
  unoptimized = false,
  size,
  imageSize = size ?? 200,
  className,
}: OttoImageProps) {
  return (
    <StyledContainer size={size} className={className}>
      <StyledImage>
        {src && (
          <Image
            draggable="false"
            unoptimized={unoptimized}
            width={imageSize}
            height={imageSize}
            src={{ src, blurDataURL: loadingImage, width: imageSize, height: imageSize }}
          />
        )}
      </StyledImage>
    </StyledContainer>
  )
}
