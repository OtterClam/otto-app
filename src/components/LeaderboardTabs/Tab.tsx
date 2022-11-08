import { Banner } from 'models/Banner'
import Link from 'next/link'
import { useRouter } from 'next/router'
import styled from 'styled-components/macro'

const StyledButton = styled.a`
  background: ${({ theme }) => theme.colors.darkGray100};
  border: 2px ${({ theme }) => theme.colors.otterBlack} solid;
  border-radius: 20px;
  line-height: 0;

  &:hover,
  &[data-active='true'] {
    background: ${({ theme }) => theme.colors.crownYellow};
    box-shadow: 0px 0px 10px ${({ theme }) => theme.colors.crownYellow};
  }
`

const StyledImage = styled.img`
  background: ${({ theme }) => theme.colors.darkGray100};
  border: 2px ${({ theme }) => theme.colors.otterBlack} solid;
  border-radius: 14px;
  width: 438px;
  height: 113px;
  margin: 5px;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    width: 156px;
    height: 48px;
  }
`

export default function LeaderboardTab({ banner }: { banner: Banner }) {
  const { asPath } = useRouter()
  return (
    <Link href={banner.link} passHref>
      <StyledButton data-active={asPath === banner.link ? 'true' : 'false'}>
        <StyledImage src={banner.image} />
      </StyledButton>
    </Link>
  )
}
