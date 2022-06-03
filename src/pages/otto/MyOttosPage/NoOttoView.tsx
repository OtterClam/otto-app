import Button from 'components/Button'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import styled from 'styled-components/macro'
import { ContentSmall, Headline } from 'styles/typography'
import NoOttoImage from './no-otto.png'

const StyledNoOttoView = styled.div`
  width: 100%;
  height: calc(100vh - 186px);
  display: flex;
  justify-content: center;
  background: #fff;
`

const StyledInnerContainer = styled.div`
  max-width: 320px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
  justify-content: center;
`

const StyledMainImage = styled.img`
  width: 220px;
  height: 192px;
`

const StyledHelpText = styled.p``

export default function NoOttoView() {
  const { t } = useTranslation()
  return (
    <StyledNoOttoView>
      <StyledInnerContainer>
        <StyledMainImage src={NoOttoImage} />
        <StyledHelpText>
          <ContentSmall>{t('my_ottos.no_otto')}</ContentSmall>
        </StyledHelpText>
        <Link to="/mint">
          <Button Typography={Headline}>{t('my_ottos.mint_portal')}</Button>
        </Link>
      </StyledInnerContainer>
    </StyledNoOttoView>
  )
}
