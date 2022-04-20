import { shortenAddress, useEthers, useTokenAllowance, useTokenBalance } from '@usedapp/core'
import CLAM from 'assets/clam.png'
import ETH from 'assets/eth.png'
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

const StyledPaymentMethod = styled(ContentLarge)`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const StyledETHMintPrice = styled(ContentLarge).attrs({ as: 'p' })`
  display: flex;
  justify-content: right;
  align-items: center;
  &::before {
    content: '';
    width: 24px;
    height: 24px;
    background: url(${ETH});
    display: inline-block;
    background-size: 24px 24px;
  }
`

const StyledCLAMMintPrice = styled(ContentLarge)`
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

const NotOttolistedWarning = styled(ContentLarge)`
  text-align: center;
  color: ${({ theme }) => theme.colors.clamPink};
`

const StyledETHBalance = styled.p`
  display: flex;
  justify-content: right;
  align-items: center;
  &::before {
    content: '';
    width: 24px;
    height: 24px;
    background: url(${ETH});
    display: inline-block;
    background-size: 24px 24px;
  }
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

const StyledOpenSeaHint = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  background: ${({ theme }) => theme.colors.lightGray200};
  border-radius: 20px;
  padding: 20px;
  gap: 10px;
`

const StyledSmallPortal = styled.img`
  width: 48px;
  height: 48px;
`

const StyledHintText = styled(ContentMedium)`
  flex: 1;
`

const StyledHintTextHighlight = styled(ContentMedium)`
  color: ${({ theme }) => theme.colors.otterBlue};
`

type PaidOption = 'clam' | 'eth'

export default function Mint() {
  const { t } = useTranslation()
  const { isMobile } = useBreakPoints()
  const dispatch = useDispatch()
  const [paidOption, setPaidOption] = useState<PaidOption>('clam')
  const { PORTAL_CREATOR, WETH, CLAM } = useContractAddresses()
  const { account, chainId } = useEthers()
  const [ethPrice, clamPrice, clamPerETH, saleStage] = useMintInfo()
  const ottolisted = useOttolisted()
  const maxCanMint = saleStage.lte(1) ? ottolisted : 6
  const [quantity, setQuantity] = useState(maxCanMint || 0)
  const [ottoSupply, ottoBalance] = useOttoInfo()
  const ethBalance = useTokenBalance(paidOption === 'eth' && WETH, account, { chainId }) || 0
  const clamBalance = useTokenBalance(paidOption === 'clam' && CLAM, account, { chainId }) || 0
  const ethAllowance = useTokenAllowance(paidOption === 'eth' && WETH, account, PORTAL_CREATOR, { chainId })
  const clamAllowance = useTokenAllowance(paidOption === 'clam' && CLAM, account, PORTAL_CREATOR, { chainId })
  const { approveState, approve } = useApprove(paidOption)
  const { mintState, mint, resetMint } = useMint()
  const totalPaymentETH = ethPrice.mul(quantity)
  const totalPaymentCLAM = clamPrice.mul(quantity)
  const hasEthAllowance = ethAllowance?.gte(totalPaymentETH)
  const hasClamAllowance = clamAllowance?.gte(totalPaymentCLAM)
  const hasAllowance = paidOption === 'clam' ? hasClamAllowance : hasEthAllowance
  const onApprove = useCallback(() => {
    approve(PORTAL_CREATOR, paidOption === 'clam' ? ethers.utils.parseUnits('10000', 9) : ethers.utils.parseEther('1'))
  }, [paidOption, totalPaymentCLAM, totalPaymentETH, approve])
  const onMint = useCallback(() => {
    // Set CLAM have 1% slippage
    const payment = paidOption === 'clam' ? totalPaymentCLAM.mul(10100).div(10000) : totalPaymentETH
    mint(account, quantity, payment, paidOption === 'clam')
  }, [account, quantity, totalPaymentETH, totalPaymentCLAM, paidOption, mint])

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
        {ottoBalance.gt(0) && (
          <StyledOpenSeaHint>
            <StyledSmallPortal src={SmallPortalImage} />
            <StyledHintText>
              {t('mint.minted_desc')}
              <StyledHintTextHighlight>
                {t('mint.minted_desc_amount', { amount: ottoBalance.toString() })}
              </StyledHintTextHighlight>
              .
            </StyledHintText>
            <a href={`https://opensea.io/${account}`} target="_blank" rel="noreferrer">
              <Button>
                <Headline>{t('mint.check_on_opensea')}</Headline>
              </Button>
            </a>
          </StyledOpenSeaHint>
        )}
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
                  <StyledETHMintPrice>{ethers.utils.formatEther(ethPrice)}</StyledETHMintPrice>
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
            <StyledPaymentMethod as="p">
              {t('mint.payment_method')} <Note> (1 ETH = {trim(ethers.utils.formatUnits(clamPerETH, 9), 2)} CLAM)</Note>
            </StyledPaymentMethod>
            <StyledSelector selected={paidOption === 'clam'} onClick={() => setPaidOption('clam')}>
              <StyledSelectorText as="p">{t('mint.pay_with_clam')}</StyledSelectorText>
              <StyledETHMintPrice>
                {ethers.utils.formatEther(totalPaymentETH.mul(7000).div(10000))} =
              </StyledETHMintPrice>
              <StyledCLAMMintPrice>{trim(ethers.utils.formatUnits(totalPaymentCLAM, 9), 2)}</StyledCLAMMintPrice>
            </StyledSelector>
            <StyledSelector selected={paidOption === 'eth'} onClick={() => setPaidOption('eth')}>
              <ContentLarge as="p">{t('mint.pay_with_eth')}</ContentLarge>
              <StyledETHMintPrice>{ethers.utils.formatEther(totalPaymentETH)}</StyledETHMintPrice>
            </StyledSelector>
          </StyledLeftSection>
          <StyledRightSection>
            <ContentLarge as="h2">
              {t('mint.mint.mint_summary', { address: account ? shortenAddress(account) : '' })}
            </ContentLarge>
            <StyledSummary>
              {account && (
                <>
                  {paidOption === 'eth' && (
                    <StyledSummaryItem>
                      <p>{t('mint.eth_balance')}</p>
                      <StyledETHBalance>{trim(ethers.utils.formatEther(ethBalance), 4)}</StyledETHBalance>
                    </StyledSummaryItem>
                  )}
                  {paidOption === 'clam' && (
                    <StyledSummaryItem>
                      <p>{t('mint.clam_balance')}</p>
                      <StyledCLAMBalance>{trim(ethers.utils.formatUnits(clamBalance, 9), 2)}</StyledCLAMBalance>
                    </StyledSummaryItem>
                  )}
                  <StyledSummaryItem>
                    <p>{t('mint.portal_amount')}</p>
                    <p>{quantity}</p>
                  </StyledSummaryItem>
                  <StyledDivider />
                  {paidOption === 'eth' && (
                    <StyledSummaryItem>
                      <p>{t('mint.total_payment')}</p>
                      <StyledETHBalance>{trim(ethers.utils.formatEther(totalPaymentETH), 4)}</StyledETHBalance>
                    </StyledSummaryItem>
                  )}
                  {paidOption === 'clam' && (
                    <StyledSummaryItem>
                      <p>{t('mint.total_payment')}</p>
                      <StyledCLAMBalance>{trim(ethers.utils.formatUnits(totalPaymentCLAM, 9), 2)} </StyledCLAMBalance>
                    </StyledSummaryItem>
                  )}
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
