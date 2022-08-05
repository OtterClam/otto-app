import { shortenAddress, useEthers, useTokenAllowance, useTokenBalance } from '@usedapp/core'
import CLAM from 'assets/clam.png'
import Button from 'components/Button'
import { BUY_CLAM_LINK } from 'constant'
import { useApprove, useMint } from 'contracts/functions'
import { useMintInfo, useOttoInfo } from 'contracts/views'
import { ethers } from 'ethers'
import { trim } from 'helpers/trim'
import useContractAddresses from 'hooks/useContractAddresses'
import { useBreakpoints } from 'contexts/Breakpoints'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'next-i18next'
import { useDispatch } from 'react-redux'
import { connectWallet, mintFailed, mintStart, mintSuccess } from 'store/uiSlice'
import styled from 'styled-components/macro'
import { Caption, ContentLarge, ContentMedium, ContentSmall, Display2, Headline, Note } from 'styles/typography'
import PortalPreviewImage from './portal-preview.png'

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

const StyledCLAMMintPrice = styled(ContentLarge).attrs({ as: 'div' })`
  display: flex;
  justify-content: right;
  align-items: center;
  margin-left: 4px;
  &::before {
    content: '';
    width: 24px;
    height: 24px;
    background: url(${CLAM.src});
    display: inline-block;
    background-size: 24px 24px;
    margin-right: 5px; */

`

const StyledOriginPrice = styled(ContentLarge)`
  text-decoration: line-through;
  margin-right: 5px;
`

const StyledDiscount = styled(Note).attrs({ as: 'p' })`
  color: ${({ theme }) => theme.colors.white};
  background: ${({ theme }) => theme.colors.clamPink};
  padding: 5px;
  border-radius: 5px;
  margin-left: 5px;
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
    background: url(${CLAM.src});
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
    background: url(${CLAM.src});
    display: inline-block;
    background-size: 24px 24px;
  }
`

const ORIGIN_PRICE = ethers.utils.parseUnits('50', 9)

const percentFormatter = new Intl.NumberFormat('en-US', {
  style: 'percent',
})

export default function Mint() {
  const { t } = useTranslation()
  const { isMobile } = useBreakpoints()
  const dispatch = useDispatch()
  const { PORTAL_CREATOR, CLAM } = useContractAddresses()
  const { account, chainId } = useEthers()
  const maxCanMint = 6
  const [quantity, setQuantity] = useState(maxCanMint)
  const clamPrice = useMintInfo(quantity)
  const [ottoSupply] = useOttoInfo()
  const clamBalance = useTokenBalance(CLAM, account, { chainId }) || 0
  const clamAllowance = useTokenAllowance(CLAM, account, PORTAL_CREATOR, { chainId })
  const { approveState, approve } = useApprove()
  const { mintState, mint, resetMint } = useMint()
  const totalPaymentCLAM = clamPrice.mul(quantity)
  const hasAllowance = clamAllowance?.gte(totalPaymentCLAM)
  const hasDiscount = clamPrice.lt(ORIGIN_PRICE)
  const onApprove = useCallback(() => {
    approve(PORTAL_CREATOR, ethers.utils.parseUnits('10000', 9))
  }, [totalPaymentCLAM, approve])
  const onMint = useCallback(() => {
    if (account) {
      mint(account, quantity, totalPaymentCLAM, true)
    }
  }, [account, quantity, totalPaymentCLAM, mint])

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
                <StyledPortalImage src={PortalPreviewImage.src} />
                <StyledPortalInfo>
                  <StyledPortalInfoTitle>{t('mint.mint.portal')}</StyledPortalInfoTitle>
                  <StyledPortalInfoDesc>{t('mint.mint.info_desc')}</StyledPortalInfoDesc>
                  <StyledPortalInfoAmountLeft>
                    {t('mint.mint.amount_left', { amount: 5000 - ottoSupply })}
                  </StyledPortalInfoAmountLeft>
                  {clamPrice.gt(0) && (
                    <StyledCLAMMintPrice>
                      {hasDiscount && (
                        <StyledOriginPrice>{ethers.utils.formatUnits(ORIGIN_PRICE, 9)}</StyledOriginPrice>
                      )}
                      {ethers.utils.formatUnits(clamPrice, 9)}
                      {hasDiscount && (
                        <StyledDiscount>
                          {t('mint.mint.discount', {
                            discount: percentFormatter.format(
                              ORIGIN_PRICE.sub(clamPrice).toNumber() / ORIGIN_PRICE.toNumber()
                            ),
                          })}
                        </StyledDiscount>
                      )}
                    </StyledCLAMMintPrice>
                  )}
                </StyledPortalInfo>
              </StyledCardTopContainer>
              <StyledCardBottomContainer>
                <StyledButtons>
                  <Button
                    padding={isMobile ? '8px 16px' : '4px 20px'}
                    Typography={Headline}
                    onClick={() => setQuantity(Math.max(quantity - 1, 1))}
                  >
                    -
                  </Button>
                  <StyledQuantity>
                    <ContentLarge>{quantity}</ContentLarge>
                  </StyledQuantity>
                  <Button
                    padding={isMobile ? '8px 16px' : '4px 20px'}
                    onClick={() => setQuantity(Math.min(quantity + 1, maxCanMint))}
                    Typography={Headline}
                  >
                    +
                  </Button>
                  <Button
                    primaryColor="white"
                    padding={isMobile ? '8px 10px' : '4px 20px'}
                    onClick={() => setQuantity(maxCanMint)}
                    Typography={Headline}
                  >
                    Max
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
              <Button Typography={Headline} onClick={() => dispatch(connectWallet())}>
                {t('mint.connect')}
              </Button>
            )}
            {account && hasAllowance && (
              <Button Typography={Headline} onClick={onMint}>
                {t('mint.mint_button')}
              </Button>
            )}
            {account && !hasAllowance && (
              <Button Typography={Headline} onClick={onApprove} loading={approveState.status === 'Mining'}>
                {t('mint.approve_button')}
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
