import Link from 'next/link'
import styled from 'styled-components/macro'
import { ContentMedium, ContentSmall } from 'styles/typography'

const StyledInfo = styled.div`
  display: flex;
  align-items: center;
  border-radius: 20px;
  background: ${({ theme }) => theme.colors.darkGray400};
  padding: 20px 40px;
  gap: 10px;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    padding: 10px;
  }
`

const StyledImage = styled.img`
  width: 134px;
  @media ${({ theme }) => theme.breakpoints.mobile} {
    width: 80px;
  }
`

const StyledContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

const StyledDesc = styled(ContentMedium).attrs({ as: 'p' })``

const StyledLinks = styled.div`
  display: flex;
  justify-content: space-evenly;
`

const StyledLink = styled(ContentSmall).attrs({ as: 'div' })`
  color: ${({ theme }) => theme.colors.seaweedGreen};
`

interface Props {
  image: string
  desc: string
  links: { text: string; href: string; internal?: boolean }[]
}

export default function Info({ image, desc, links }: Props) {
  return (
    <StyledInfo>
      <StyledImage src={image} />
      <StyledContent>
        <StyledDesc>{desc}</StyledDesc>
        <StyledLinks>
          {links.map((link, index) =>
            link.internal ? (
              <Link key={index} href={link.href}>
                <StyledLink>{link.text}</StyledLink>
              </Link>
            ) : (
              <a key={index} href={link.href} target="_blank" rel="noreferrer">
                <StyledLink>{link.text}</StyledLink>
              </a>
            )
          )}
        </StyledLinks>
      </StyledContent>
    </StyledInfo>
  )
}
