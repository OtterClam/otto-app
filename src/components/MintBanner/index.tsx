import Button from 'components/Button'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { Display2, Display3, Headline } from 'styles/typography'
import PortalLight from './portal-light.png'

const StyledMintBanner = styled.div`
  width: 100%;
  position: relative;
  border: 4px solid ${({ theme }) => theme.colors.otterBlack};
  border-radius: 20px;
  background-color: ${({ theme }) => theme.colors.lightGray400};
  color: ${({ theme }) => theme.colors.otterBlack};
`

const StyledInnerButton = styled.div`
  width: 100%;
  height: calc(100% - 6px);
  background-color: ${({ theme }) => theme.colors.lightGray200};
  padding: 6px;
  margin: 0 0 6px 0;
  outline: 4px solid ${({ theme }) => theme.colors.otterBlack};
  border-radius: 16px;
`

const StyledContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  background-color: ${({ theme }) => theme.colors.otterBlack};
  color: white;
  border-radius: 10px;
  gap: 20px;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    gap: 0;
    padding: 6px 0;
  }
`

const StyledImg = styled.img`
  width: 185px;
  @media ${({ theme }) => theme.breakpoints.mobile} {
    width: 138px;
  }
`

const StyledParagraph = styled.p`
  display: flex;
  flex-direction: column;
`

interface Props {
  className?: string
}

export default function MintBanner({ className }: Props) {
  const { t } = useTranslation()
  return (
    <StyledMintBanner className={className}>
      <StyledInnerButton>
        <StyledContainer>
          <StyledImg src={PortalLight} alt="mint" />
          <StyledParagraph>
            <Display3>{t('mint_banner.para1')}</Display3>
            <Display2>{t('mint_banner.para2')}</Display2>
          </StyledParagraph>
          <Link to="/mint">
            <Button primaryColor="pink" padding="6px 10px">
              <Headline>{t('mint_banner.cta')}</Headline>
            </Button>
          </Link>
        </StyledContainer>
      </StyledInnerButton>
    </StyledMintBanner>
  )
}
