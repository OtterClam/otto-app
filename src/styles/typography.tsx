import styled from 'styled-components/macro'

export const Display1 = styled.span`
  font-family: 'PaytoneOne', 'naikaifont';
  font-weight: 400;
  font-size: 60px;
  line-height: 1.5;
  @media ${({ theme }) => theme.breakpoints.mobile} {
    font-size: 48px;
  }
`

export const Display2 = styled.span`
  font-family: 'PaytoneOne', 'naikaifont';
  font-weight: 400;
  font-size: 48px;
  line-height: 1.5;
  @media ${({ theme }) => theme.breakpoints.mobile} {
    font-size: 36px;
  }
`

export const Display3 = styled.span`
  font-family: 'Pangolin', 'naikaifont';
  font-size: 36px;
  font-weight: 400;
  line-height: 1.5;
  @media ${({ theme }) => theme.breakpoints.mobile} {
    font-size: 24px;
  }
`

export const Headline = styled.span`
  font-family: 'Pangolin', 'naikaifont';
  font-size: 24px;
  font-weight: 400;
  line-height: 1.5;
  @media ${({ theme }) => theme.breakpoints.mobile} {
    font-size: 20px;
  }
`

export const ContentLarge = styled.span`
  font-family: 'Pangolin', 'naikaifont';
  font-size: 20px;
  font-weight: 400;
  line-height: 1.5;
  @media ${({ theme }) => theme.breakpoints.mobile} {
    font-size: 18px;
  }
`

export const ContentMedium = styled.span`
  font-family: 'Pangolin', 'naikaifont';
  font-size: 18px;
  font-weight: 400;
  line-height: 1.5;
  @media ${({ theme }) => theme.breakpoints.mobile} {
    font-size: 16px;
  }
`

export const ContentSmall = styled.span`
  white-space: pre-line;
  font-family: 'Pangolin', 'naikaifont';
  font-size: 16px;
  font-weight: 400;
  line-height: 1.5;
  @media ${({ theme }) => theme.breakpoints.mobile} {
    font-size: 14px;
  }
`

export const RegularInput = styled.input`
  white-space: pre-line;
  font-family: 'Pangolin', 'naikaifont';
  font-size: 16px;
  font-weight: 400;
  line-height: 1.5;
  @media ${({ theme }) => theme.breakpoints.mobile} {
    font-size: 14px;
  }
`

export const ContentExtraSmall = styled.span`
  font-family: 'Pangolin', 'naikaifont';
  font-size: 16px;
  font-weight: 400;
  line-height: 1.5;
  @media ${({ theme }) => theme.breakpoints.mobile} {
    font-size: 14px;
  }
`

export const Caption = styled.span`
  font-family: 'Pangolin', 'naikaifont';
  font-size: 14px;
  font-weight: 400;
  line-height: 1.5;
  @media ${({ theme }) => theme.breakpoints.mobile} {
    font-size: 12px;
  }
`

export const Note = styled.span`
  font-family: 'Pangolin', 'naikaifont';
  font-size: 12px;
  font-weight: 400;
  line-height: 1.5;
  @media ${({ theme }) => theme.breakpoints.mobile} {
    font-size: 12px;
  }
`
