import { shortenAddress, useEthers } from '@usedapp/core'
import { useETHMintPrice } from 'contracts/views'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { Caption, ContentLarge, Display2, Headline } from 'styles/typography'
import PortalPreviewImage from './portal-preview.png'

const StyledMint = styled.section`
  width: 90%;
  width: 100%;
  margin-bottom: 45px;
  padding: 3px;
  border: 2px solid #1d2654;
  backdrop-filter: blur(5px);
  /* Note: backdrop-filter has minimal browser support */
  border-radius: 15px;
  background-color: ${({ theme }) => theme.colors.crownYellow};
`

const StyledContainer = styled.div`
  width: 100%;
  height: 100%;
  padding: 40px;
  border: 2px solid ${({ theme }) => theme.colors.otterBlack};
  border-radius: 10px;
  background-color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  color: ${({ theme }) => theme.colors.otterBlack};
`

const StyledTitle = styled.h2``

const StyledSection = styled.div`
  display: flex;
`

const StyledLeftSection = styled.div``

const StyledRightSection = styled.div``

const StyledCard = styled.div`
  border: 2px solid ${({ theme }) => theme.colors.lightGray200};
  border-radius: 20px;
  padding: 20px;
`

const StyledCardTopContainer = styled.div`
  display: flex;
`

const StyledCardBottomContainer = styled.div``

const StyledPortalImage = styled.img`
  width: 160px;
`

const StyledPortalInfo = styled.div``

const StyledPortalInfoTitle = styled(Headline).attrs({ as: 'h3' })``

const StyledPortalInfoDesc = styled(Caption).attrs({ as: 'p' })``

const StyledPortalInfoAmountLeft = styled(Caption).attrs({ as: 'p' })`
  color: ${({ theme }) => theme.colors.clamPink};
`

const StyledETHMintPrice = styled(ContentLarge)``

export default function Mint() {
  const { t } = useTranslation()
  const { account } = useEthers()
  const ethPrice = useETHMintPrice()
  return (
    <StyledMint>
      <StyledContainer>
        <StyledTitle>
          <Display2>{t('mint.mint.title')}</Display2>
        </StyledTitle>
        <StyledSection>
          <StyledLeftSection>
            <StyledCard>
              <StyledCardTopContainer>
                <StyledPortalImage src={PortalPreviewImage} />
                <StyledPortalInfo>
                  <StyledPortalInfoTitle>{t('mint.mint.portal')}</StyledPortalInfoTitle>
                  <StyledPortalInfoDesc>{t('mint.mint.info_desc')}</StyledPortalInfoDesc>
                  <StyledPortalInfoAmountLeft>{t('mint.mint.amount_left', { amount: '0' })}</StyledPortalInfoAmountLeft>
                  <StyledETHMintPrice>{ethPrice}</StyledETHMintPrice>
                </StyledPortalInfo>
              </StyledCardTopContainer>
              <StyledCardBottomContainer />
            </StyledCard>
          </StyledLeftSection>
          <StyledRightSection>
            <ContentLarge>
              {t('mint.mint.mint_summary', { address: account ? shortenAddress(account) : '' })}
            </ContentLarge>
          </StyledRightSection>
        </StyledSection>
      </StyledContainer>
    </StyledMint>
  )
}
