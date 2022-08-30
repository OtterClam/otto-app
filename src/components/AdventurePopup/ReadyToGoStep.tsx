import Otto from 'models/Otto'
import { useTranslation } from 'next-i18next'
import styled from 'styled-components/macro'
import { ContentLarge, Display1 } from 'styles/typography'

interface Props {
  otto: Otto
}

const StyledReadyToGoStep = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 116px 20px 70px 20px;
  color: ${({ theme }) => theme.colors.white};
  gap: 10px;
`

const StyledAvatar = styled.img`
  width: 140px;
  height: 140px;
`

const StyledTitle = styled(Display1).attrs({ as: 'h1' })`
  text-align: center;
`

const StyledDesc = styled(ContentLarge).attrs({ as: 'p' })`
  text-align: center;
`

export default function ReadyToGoStep({ otto }: Props) {
  const { t } = useTranslation('', { keyPrefix: 'adventurePopup.readyToGoStep' })
  return (
    <StyledReadyToGoStep>
      <StyledAvatar src={otto.image} alt={otto.name} />
      <StyledTitle>{t('title')}</StyledTitle>
      <StyledDesc>{t('desc', { name: otto.name })}</StyledDesc>
    </StyledReadyToGoStep>
  )
}
