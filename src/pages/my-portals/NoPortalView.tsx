import Button from 'components/Button'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { ContentSmall, Headline } from 'styles/typography'
import WhiteBlankPortal from './white-blank-portal.png'

const StyledNoPortalView = styled.div`
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

export default function NoPortalView() {
  const { t } = useTranslation()
  return (
    <StyledNoPortalView>
      <StyledInnerContainer>
        <StyledMainImage src={WhiteBlankPortal} />
        <StyledHelpText>
          <ContentSmall>{t('my_portals.no_portal')}</ContentSmall>
        </StyledHelpText>
        <Link to="/mint">
          <Button>
            <Headline>{t('my_portals.mint_portal')}</Headline>
          </Button>
        </Link>
      </StyledInnerContainer>
    </StyledNoPortalView>
  )
}
