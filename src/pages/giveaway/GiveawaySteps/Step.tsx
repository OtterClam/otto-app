import Button from 'components/Button'
import styled from 'styled-components/macro'
import { ContentSmall, Headline } from 'styles/typography'
import LockedIcon from 'assets/ui/locked.svg'

const StyledStep = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  border: 4px solid ${({ theme }) => theme.colors.otterBlue};
  border-radius: 10px;
  padding: 20px;
  background: ${({ theme }) => theme.colors.white};
`

const StyledIcon = styled.img`
  width: 24px;
  height: 24px;
`

const StyledDesc = styled(ContentSmall).attrs({ as: 'p' })`
  flex: 1;
  white-space: pre;
`

const StyledLockedButton = styled(Button)`
  img {
    width: 20px;
    height: 20px;
  }
`

interface Props {
  icon: string
  desc: string
  locked: boolean
  action: string
  onClick: () => void
  className?: string
}

export default function Step({ icon, desc, locked, action, onClick, className }: Props) {
  return (
    <StyledStep className={className}>
      <StyledIcon src={icon} alt={desc} />
      <StyledDesc>{desc}</StyledDesc>
      {locked ? (
        <StyledLockedButton disabled padding="6px 10px">
          <img src={LockedIcon} alt="locked" />
        </StyledLockedButton>
      ) : (
        <Button height="60px" padding="0 10px" onClick={onClick}>
          <Headline>{action}</Headline>
        </Button>
      )}
    </StyledStep>
  )
}
