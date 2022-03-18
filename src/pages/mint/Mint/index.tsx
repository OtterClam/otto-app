import { shortenAddress, useEthers, useTokenAllowance, useTokenBalance } from '@usedapp/core'
import { useMintInfo, useOttolisted, useOttoSupply } from 'contracts/views'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { Caption, ContentLarge, ContentMedium, ContentSmall, Display2, Headline } from 'styles/typography'
import ETH from 'assets/eth.png'
import CLAM from 'assets/clam.png'
import Button from 'components/Button'
import { useState } from 'react'
import useContractAddresses from 'hooks/useContractAddresses'
import { ethers, BigNumber } from 'ethers'
import { useApprove, useMint } from 'contracts/functions'
import { useDispatch } from 'react-redux'
import { connectWallet, mintStart, mintSuccess, mintFailed } from 'store/uiSlice'
import PortalPreviewImage from './portal-preview.png'

const StyledMint = styled.section`
  width: 90%;
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

const StyledTitle = styled(Display2).attrs({ as: 'h2' })``

const StyledSection = styled.div`
  display: flex;
  gap: 30px;
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
`

const StyledCardBottomContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`

const StyledPortalImage = styled.img`
  width: 160px;
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
`

interface SelectorProps {
  selected: boolean
}

const StyledSelector = styled.button<SelectorProps>`
  width: 100%;
  display: flex;
  border: 4px solid ${({ theme, selected }) => (selected ? theme.colors.otterBlue : theme.colors.lightGray300)};
  border-radius: 10px;
  padding: 20px;
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

type PaidOption = 'clam' | 'eth'

export default function Mint() {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [quantity, setQuantity] = useState(1)
  const [paidOption, setPaidOption] = useState<PaidOption>('clam')
  const { PORTAL_CREATOR, WETH, CLAM } = useContractAddresses()
  const { account } = useEthers()
  const [ethPrice, clamPerETH] = useMintInfo()
  const ottolisted = useOttolisted()
  const ottoSupply = useOttoSupply()
  const ethBalance = useTokenBalance(WETH, account) || 0
  const clamBalance = useTokenBalance(CLAM, account) || 0
  const ethAllowance = useTokenAllowance(WETH, account, PORTAL_CREATOR)
  const clamAllowance = useTokenAllowance(CLAM, account, PORTAL_CREATOR)
  const { approveState, approve } = useApprove(paidOption)
  const { mintState, mint } = useMint()
  const totalPaymentETH = BigNumber.from(ethPrice).mul(quantity)
  const totalPaymentCLAM = totalPaymentETH.mul(clamPerETH).div(1e9)
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
                    {t('mint.mint.amount_left', { amount: 5000 - ottoSupply })}
                  </StyledPortalInfoAmountLeft>
                  <StyledETHMintPrice>{ethers.utils.formatEther(ethPrice)}</StyledETHMintPrice>
                </StyledPortalInfo>
              </StyledCardTopContainer>
              <StyledCardBottomContainer>
                <StyledButtons>
                  <Button padding="4px 20px" click={() => setQuantity(Math.max(quantity - 1, 1))}>
                    <Headline>-</Headline>
                  </Button>
                  <StyledQuantity>
                    <ContentLarge>{quantity}</ContentLarge>
                  </StyledQuantity>
                  <Button padding="4px 20px" click={() => setQuantity(Math.min(quantity + 1, ottolisted))}>
                    <Headline>+</Headline>
                  </Button>
                  <Button primaryColor="white" padding="4px 20px" click={() => setQuantity(ottolisted)}>
                    <Headline>Max</Headline>
                  </Button>
                </StyledButtons>
              </StyledCardBottomContainer>
            </StyledCard>
            <ContentLarge as="p">Payment Method {ethers.utils.formatUnits(clamPerETH, 9)}</ContentLarge>
            <StyledSelector selected={paidOption === 'clam'} onClick={() => setPaidOption('clam')}>
              <ContentLarge>Paid with CLAM</ContentLarge>
            </StyledSelector>
            <StyledSelector selected={paidOption === 'eth'} onClick={() => setPaidOption('eth')}>
              <ContentLarge>Paid with ETH</ContentLarge>
            </StyledSelector>
          </StyledLeftSection>
          <StyledRightSection>
            <ContentLarge as="h2">
              {t('mint.mint.mint_summary', { address: account ? shortenAddress(account) : '' })}
            </ContentLarge>
            <StyledSummary>
              {account && (
                <>
                  <StyledSummaryItem>
                    <p>You ETH balance:</p>
                    <StyledETHBalance>{ethers.utils.formatEther(ethBalance)}</StyledETHBalance>
                  </StyledSummaryItem>
                  <StyledSummaryItem>
                    <p>You CLAM balance:</p>
                    <StyledCLAMBalance>{ethers.utils.formatUnits(clamBalance, 9)}</StyledCLAMBalance>
                  </StyledSummaryItem>
                  <StyledSummaryItem>
                    <p>Otto Portals:</p>
                    <p>{quantity}</p>
                  </StyledSummaryItem>
                  <StyledDivider />
                  {paidOption === 'eth' && (
                    <StyledSummaryItem>
                      <p>total:</p>
                      <StyledETHBalance>{ethers.utils.formatEther(totalPaymentETH)} ETH</StyledETHBalance>
                    </StyledSummaryItem>
                  )}
                  {paidOption === 'clam' && (
                    <StyledSummaryItem>
                      <p>Total Payment:</p>
                      <StyledCLAMBalance>{ethers.utils.formatUnits(totalPaymentCLAM)} </StyledCLAMBalance>
                    </StyledSummaryItem>
                  )}
                </>
              )}
              {!account && <ContentSmall>Please connect your wallet to proceed the process.</ContentSmall>}
            </StyledSummary>
            {!account && (
              <Button click={() => dispatch(connectWallet())}>
                <Headline>Connect</Headline>
              </Button>
            )}
            {account && paidOption === 'eth' && ethAllowance?.gte(totalPaymentETH) && (
              <Button>
                <Headline>Mint with ETH</Headline>
              </Button>
            )}
            {account && paidOption === 'eth' && ethAllowance?.lt(totalPaymentETH) && (
              <Button>
                <Headline>Approve ETH</Headline>
              </Button>
            )}
            {account && paidOption === 'clam' && clamAllowance?.gte(totalPaymentCLAM) && (
              <Button>
                <Headline>Mint CLAM</Headline>
              </Button>
            )}
            {account && paidOption === 'clam' && clamAllowance?.lt(totalPaymentCLAM) && (
              <Button
                click={() => approve(PORTAL_CREATOR, totalPaymentCLAM.mul(2))}
                loading={approveState.status === 'Mining'}
              >
                <Headline>Approve CLAM</Headline>
              </Button>
            )}
          </StyledRightSection>
        </StyledSection>
      </StyledContainer>
    </StyledMint>
  )
}
