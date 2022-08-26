import HelpButton from 'components/HelpButton'
import Otto from 'models/Otto'
import { useTranslation } from 'next-i18next'
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

const StyledBoost = styled.div``

export interface AdventureConditionalBoostsProps {
  otto?: Otto
}

export default function AdventureConditionalBoosts({ otto }: AdventureConditionalBoostsProps) {
  const { t } = useTranslation('', { keyPrefix: 'adventureBoosts' })

  return (
    <StyledContainer>
      <StyledTitle>
        {t('conditionalBoosts')}
        <StyledHelpButton message="test" />
      </StyledTitle>
    </StyledContainer>
  )
}
