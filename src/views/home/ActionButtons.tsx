import GiveawayButton from 'components/GiveawayButton'
import NewsButton from 'components/NewsButton'
import styled from 'styled-components/macro'

const StyledContainer = styled.div`
  display: flex;
  gap: 5px;
`

export interface ActionButtonsProps {
  className?: string
}

export default function ActionButtons({ className }: ActionButtonsProps) {
  return (
    <StyledContainer className={className}>
      <NewsButton />
      <GiveawayButton />
    </StyledContainer>
  )
}
