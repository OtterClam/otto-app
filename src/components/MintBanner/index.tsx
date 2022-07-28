import Button from 'components/Button'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import styled from 'styled-components/macro'
import { Display2, Headline } from 'styles/typography'
import JoinUsImage from './join-us.png'

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
    flex-direction: column;
    gap: 10px;
    padding: 12px 0;
  }
`

const StyledImg = styled.img`
  height: 135px;
  margin-right: -48px;
`

const StyledParagraph = styled.p`
  display: flex;
  flex-direction: column;
  align-items: center;
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
          <StyledImg src={JoinUsImage.src} alt="mint" />
          <StyledParagraph>
            <Headline>{t('mint_banner.para1')}</Headline>
            <Display2>{t('mint_banner.para2')}</Display2>
          </StyledParagraph>
          <Link href="/mint">
            <a href="/mint">
              <Button primaryColor="pink" padding="6px 10px" Typography={Headline}>
                {t('mint_banner.cta')}
              </Button>
            </a>
          </Link>
        </StyledContainer>
      </StyledInnerButton>
    </StyledMintBanner>
  )
}
