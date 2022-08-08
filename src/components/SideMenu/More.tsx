import { DAO_LINK, WHITE_PAPER_LINK } from 'constant'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import styled from 'styled-components/macro'
import { Note } from 'styles/typography'
import bgImage from './more.png'

const StyledContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
`

const StyledItem = styled.a<{ image: [number, number] }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  background: ${({ theme }) => theme.colors.white};
  border-radius: 10px;
  box-sizing: border-box;
  border: 3px ${({ theme }) => theme.colors.lightGray400} solid;
  padding: 12px 0;

  &:hover {
    background: ${({ theme }) => theme.colors.lightGray100};
  }

  &::before {
    content: '';
    display: block;
    width: 48px;
    height: 42px;
    background: ${({ image }) => `-${(image[0] * bgImage.width) / 4}px -${(image[1] * bgImage.height) / 4}px`} /
      ${bgImage.width / 2}px ${bgImage.height / 2}px url(${bgImage.src});
  }
`

const items: { key: string; image: [number, number]; link: string }[] = [
  { key: 'play', image: [1, 0], link: WHITE_PAPER_LINK },
  { key: 'dao', image: [0, 0], link: DAO_LINK },
]

export default function More() {
  const { t } = useTranslation('', { keyPrefix: 'side_menu.more_items' })

  return (
    <StyledContainer>
      {items.map(item => (
        <Link href={item.link} passHref>
          <StyledItem image={item.image} target="_blank" rel="noreferrer">
            <Note>{t(item.key)}</Note>
          </StyledItem>
        </Link>
      ))}
    </StyledContainer>
  )
}
