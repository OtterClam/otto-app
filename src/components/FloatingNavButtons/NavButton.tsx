import ImageButton from 'components/ImageButton'
import NotificationBadge from 'components/NotificationBadge'
import Link from 'next/link'
import styled from 'styled-components/macro'
import { Note } from 'styles/typography'
import { textStroke } from 'utils/styles'

const StyledContainer = styled(NotificationBadge)`
  padding-bottom: 8px;

  &::before {
    right: 0;
    top: 0;
  }
`

const StyledLabel = styled(Note)`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  text-align: center;
  color: ${({ theme }) => theme.colors.otterBlack};
  ${({ theme }) => textStroke(3, theme.colors.white)}
`

export interface NavButtonProps {
  showNotifcationIcon?: boolean
  label: string
  link: string
  image: {
    src: string
    width: number
    height: number
  }
}

const buttonStates = ['default', ':hover']

export default function NavButton({ label, showNotifcationIcon, link, image }: NavButtonProps) {
  return (
    <StyledContainer show={showNotifcationIcon}>
      <Link href={link} passHref target="_blank">
        <ImageButton as="a" states={buttonStates} image={image}>
          <StyledLabel>{label}</StyledLabel>
        </ImageButton>
      </Link>
    </StyledContainer>
  )
}
