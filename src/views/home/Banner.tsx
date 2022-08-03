import AdBanner from 'components/AdBanner'
import SectionRope from 'components/SectionRope'
import TreasurySection from 'components/TreasurySection'
import styled from 'styled-components/macro'

const StyledContainer = styled.div`
  width: 450px;
`

const StyledSection = styled(TreasurySection)`
  width: 100%;
`

export interface BannerProps {
  className?: string
  hideRope?: boolean
}

export default function Banner({ hideRope, className }: BannerProps) {
  return (
    <StyledContainer className={className}>
      {!hideRope && <SectionRope />}
      <StyledSection showRope={false}>
        <AdBanner showIndicators={false} />
      </StyledSection>
    </StyledContainer>
  )
}
