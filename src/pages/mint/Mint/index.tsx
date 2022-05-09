import { shortenAddress, useEthers, useTokenAllowance, useTokenBalance } from '@usedapp/core'
import CLAM from 'assets/clam.png'
import Button from 'components/Button'
import { BUY_CLAM_LINK } from 'constant'
import { useApprove, useMint } from 'contracts/functions'
import { useMintInfo, useOttoInfo, useOttolisted } from 'contracts/views'
import { ethers } from 'ethers'
import { trim } from 'helpers/trim'
import useContractAddresses from 'hooks/useContractAddresses'
import { useBreakPoints } from 'hooks/useMediaQuery'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDispatch } from 'react-redux'
import { connectWallet, mintFailed, mintStart, mintSuccess } from 'store/uiSlice'
import styled from 'styled-components/macro'
import { Caption, ContentLarge, ContentMedium, ContentSmall, Display2, Headline, Note } from 'styles/typography'
import PortalPreviewImage from './portal-preview.png'
import SmallPortalImage from './portal-small.png'

const StyledMint = styled.section`
  width: 90%;
  margin-bottom: 45px;
  padding: 3px;
  border: 2px solid #1d2654;
  border-radius: 15px;
  background-color: ${({ theme }) => theme.colors.crownYellow};

  @media ${({ theme }) => theme.breakpoints.mobile} {
    width: 100%;
  }
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

  @media ${({ theme }) => theme.breakpoints.mobile} {
    padding: 10px;
  }
`

const StyledTitle = styled(Display2).attrs({ as: 'h2' })``

const StyledSection = styled.div`
  display: flex;
  gap: 30px;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    width: 100%;
    flex-direction: column;
    gap: 20px;
    padding: 10px;
  }
`

const StyledLeftSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  flex: 7;
`

const StyledRightSection = styled.div`
  flex: 3;
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const StyledCard = styled.div`
  border: 2px solid ${({ theme }) => theme.colors.lightGray200};
  border-radius: 20px;
  padding: 20px;
`

const StyledCardTopContainer = styled.div`
  display: flex;
  gap: 20px;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    width: 100%;
    flex-direction: column;
  }
`

const StyledCardBottomContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  margin-top: 10px;
  @media ${({ theme }) => theme.breakpoints.mobile} {
    align-items: center;
  }
`

const StyledPortalImage = styled.img`
  width: 160px;
  height: 160px;
`

const StyledPortalInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

const StyledPortalInfoTitle = styled(Headline).attrs({ as: 'h3' })``

const StyledPortalInfoDesc = styled(Caption).attrs({ as: 'p' })``

const StyledPortalInfoAmountLeft = styled(Caption).attrs({ as: 'p' })`
  color: ${({ theme }) => theme.colors.clamPink};
`

const StyledCLAMMintPrice = styled(ContentLarge).attrs({ as: 'p' })`
  display: flex;
  justify-content: right;
  align-items: center;
  margin-left: 4px;
  &::before {
    content: '';
    width: 24px;
    height: 24px;
    background: url(${CLAM});
    display: inline-block;
    background-size: 24px 24px;
  }
`

const StyledButtons = styled.div`
  display: flex;
  height: 60px;
  gap: 10px;
`

const StyledQuantity = styled.div`
  width: 102px;
  background: ${({ theme }) => theme.colors.lightGray200};
  border: 4px solid ${({ theme }) => theme.colors.otterBlack};
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    width: 62px;
  }
`

interface SelectorProps {
  selected: boolean
}

const StyledSelector = styled.button<SelectorProps>`
  width: 100%;
  display: flex;
  justify-content: space-between;
  text-align: left;
  border: 4px solid ${({ theme, selected }) => (selected ? theme.colors.otterBlue : theme.colors.lightGray300)};
  border-radius: 10px;
  padding: 20px;
`

const StyledSelectorText = styled(ContentLarge)`
  flex: 1;
`

const StyledSummary = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 20px;
  background: ${({ theme }) => theme.colors.lightGray200};
  border-radius: 20px;
  gap: 5px;
`

const StyledSummaryItem = styled(ContentMedium)`
  width: 100%;
  display: flex;
  justify-content: space-between;
`

const StyledDivider = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${({ theme }) => theme.colors.lightGray400};
`

const StyledCLAMBalance = styled.p`
  display: flex;
  justify-content: right;
  align-items: center;
  &::before {
    content: '';
    width: 24px;
    height: 24px;
    margin-right: 4px;
    background: url(${CLAM});
    display: inline-block;
    background-size: 24px 24px;
  }
`

const StyledBuyCLAM = styled.p`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
`

const StyledBuyCLAMLink = styled(ContentSmall)`
  color: ${({ theme }) => theme.colors.clamPink};
  display: inline-flex;
  justify-content: right;
  align-items: center;
  &::before {
    content: '';
    width: 24px;
    height: 24px;
    margin-right: 4px;
    background: url(${CLAM});
    display: inline-block;
    background-size: 24px 24px;
  }
`

export default function Mint() {
  const { t } = useTranslation()
  const { isMobile } = useBreakPoints()
  const dispatch = useDispatch()
  const { PORTAL_CREATOR, CLAM } = useContractAddresses()
  const { account, chainId } = useEthers()
  const [clamPrice, saleStage] = useMintInfo()
  const ottolisted = useOttolisted()
  const maxCanMint = saleStage.lte(1) ? ottolisted : 6
  const [quantity, setQuantity] = useState(maxCanMint || 0)
  const [ottoSupply, ottoBalance] = useOttoInfo()
  const clamBalance = useTokenBalance(CLAM, account, { chainId }) || 0
  const clamAllowance = useTokenAllowance(CLAM, account, PORTAL_CREATOR, { chainId })
  const { approveState, approve } = useApprove('clam')
  const { mintState, mint, resetMint } = useMint()
  const totalPaymentCLAM = clamPrice.mul(quantity)
  const hasAllowance = clamAllowance?.gte(totalPaymentCLAM)
  const onApprove = useCallback(() => {
    approve(PORTAL_CREATOR, ethers.utils.parseUnits('10000', 9))
  }, [totalPaymentCLAM, approve])
  const onMint = useCallback(() => {
    mint(account, quantity, totalPaymentCLAM, true)
  }, [account, quantity, totalPaymentCLAM, mint])

  useEffect(() => {
    if (maxCanMint > 0) setQuantity(maxCanMint || 0)
  }, [maxCanMint])
  useEffect(() => {
    if (mintState.status === 'Mining') dispatch(mintStart())
    if (mintState.status === 'Success') dispatch(mintSuccess(quantity))
    if (mintState.status === 'Fail' || mintState.status === 'Exception') {
      resetMint()
      dispatch(mintFailed())
      window.alert(mintState.errorMessage)
    }
  }, [mintState])

  return (
    <StyledMint>
      <StyledContainer>
        <StyledTitle>{t('mint.mint.title')}</StyledTitle>
        <StyledSection>
          <StyledLeftSection>
            <StyledCard>
              <StyledCardTopContainer>
                <StyledPortalImage src={PortalPreviewImage} />
                <StyledPortalInfo>
                  <StyledPortalInfoTitle>{t('mint.mint.portal')}</StyledPortalInfoTitle>
                  <StyledPortalInfoDesc>{t('mint.mint.info_desc')}</StyledPortalInfoDesc>
                  <StyledPortalInfoAmountLeft>
                    {t('mint.mint.amount_left', { amount: 5000 - ottoSupply.toNumber() })}
                  </StyledPortalInfoAmountLeft>
                  <StyledCLAMMintPrice>{ethers.utils.formatUnits(clamPrice, 9)}</StyledCLAMMintPrice>
                </StyledPortalInfo>
              </StyledCardTopContainer>
              <StyledCardBottomContainer>
                <StyledButtons>
                  <Button
                    disabled={maxCanMint === 0}
                    padding={isMobile ? '8px 16px' : '4px 20px'}
                    onClick={() => setQuantity(Math.max(quantity - 1, 1))}
                  >
                    <Headline>-</Headline>
                  </Button>
                  <StyledQuantity>
                    <ContentLarge>{quantity}</ContentLarge>
                  </StyledQuantity>
                  <Button
                    disabled={maxCanMint === 0}
                    padding={isMobile ? '8px 16px' : '4px 20px'}
                    onClick={() => setQuantity(Math.min(quantity + 1, maxCanMint))}
                  >
                    <Headline>+</Headline>
                  </Button>
                  <Button
                    primaryColor="white"
                    padding={isMobile ? '8px 10px' : '4px 20px'}
                    onClick={() => setQuantity(maxCanMint)}
                  >
                    <Headline>Max</Headline>
                  </Button>
                </StyledButtons>
              </StyledCardBottomContainer>
            </StyledCard>
          </StyledLeftSection>
          <StyledRightSection>
            <ContentLarge as="h2">
              {t('mint.mint.mint_summary', { address: account ? shortenAddress(account) : '' })}
            </ContentLarge>
            <StyledSummary>
              {account && (
                <>
                  <StyledSummaryItem>
                    <p>{t('mint.clam_balance')}</p>
                    <StyledCLAMBalance>{trim(ethers.utils.formatUnits(clamBalance, 9), 2)}</StyledCLAMBalance>
                  </StyledSummaryItem>
                  <StyledSummaryItem>
                    <p>{t('mint.portal_amount')}</p>
                    <p>{quantity}</p>
                  </StyledSummaryItem>
                  <StyledDivider />
                  <StyledSummaryItem>
                    <p>{t('mint.total_payment')}</p>
                    <StyledCLAMBalance>{trim(ethers.utils.formatUnits(totalPaymentCLAM, 9), 2)} </StyledCLAMBalance>
                  </StyledSummaryItem>
                </>
              )}
              {!account && <ContentSmall>{t('mint.please_connect')}</ContentSmall>}
            </StyledSummary>
            {!account && (
              <Button onClick={() => dispatch(connectWallet())}>
                <Headline>{t('mint.connect')}</Headline>
              </Button>
            )}
            {account && hasAllowance && saleStage.toNumber() > 0 && (
              <Button onClick={onMint} disabled={maxCanMint === 0}>
                <Headline>{t('mint.mint_button')}</Headline>
              </Button>
            )}
            {account && !hasAllowance && (
              <Button onClick={onApprove} loading={approveState.status === 'Mining'}>
                <Headline>{t('mint.approve_button')}</Headline>
              </Button>
            )}
            <StyledBuyCLAM>
              <ContentSmall>{t('mint.not_enough_clam')}</ContentSmall>
              <a href={BUY_CLAM_LINK} target="_blank" rel="noreferrer">
                <StyledBuyCLAMLink>{t('mint.buy')}</StyledBuyCLAMLink>
              </a>
            </StyledBuyCLAM>
          </StyledRightSection>
        </StyledSection>
      </StyledContainer>
    </StyledMint>
  )
}
