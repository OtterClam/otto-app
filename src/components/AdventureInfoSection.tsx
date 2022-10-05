import HelpButton from 'components/HelpButton'
import { PropsWithChildren } from 'react'
import styled from 'styled-components/macro'
import { Note } from 'styles/typography'

const StyledContainer = styled.div`
  background: ${({ theme }) => theme.colors.otterBlack};
  color: ${({ theme }) => theme.colors.white};
  border-radius: 10px;
  overflow: hidden;
`

const StyledTitle = styled(Note)`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 31px;
  background: ${({ theme }) => theme.colors.darkGray300};
`

const StyledHelpButton = styled(HelpButton)`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-9px);
`

const StyledBody = styled.div`
  background: ${({ theme }) => theme.colors.darkGray400};
`

export interface AdventureInfoSectionProps {
  title: string
  help?: string
}

export default function AdventureInfoSection({ title, help, children }: PropsWithChildren<AdventureInfoSectionProps>) {
  return (
    <StyledContainer>
      <StyledTitle>
        {title}
        {help && <StyledHelpButton message={help} />}
      </StyledTitle>
      <StyledBody>{children}</StyledBody>
    </StyledContainer>
  )
}
