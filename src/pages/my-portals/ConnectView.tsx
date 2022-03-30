import Button from 'components/Button'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { connectWallet } from 'store/uiSlice'
import styled from 'styled-components'
import { ContentSmall, Headline } from 'styles/typography'
import WhiteBlankPortal from './white-blank-portal.png'

const StyledConnectView = styled.div`
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

const StyledConnectImage = styled.img`
  width: 220px;
  height: 192px;
`

const StyledHelpText = styled.p``

export default function ConnectView() {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  return (
    <StyledConnectView>
      <StyledInnerContainer>
        <StyledConnectImage src={WhiteBlankPortal} />
        <StyledHelpText>
          <ContentSmall>{t('connect_help_text')}</ContentSmall>
        </StyledHelpText>
        <Button click={() => dispatch(connectWallet())}>
          <Headline>{t('connect_wallet')}</Headline>
        </Button>
      </StyledInnerContainer>
    </StyledConnectView>
  )
}
