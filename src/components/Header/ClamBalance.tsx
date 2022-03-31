import { useEthers, useTokenBalance } from '@usedapp/core'
import styled from 'styled-components'
import CLAM from 'assets/clam.png'
import useContractAddresses from 'hooks/useContractAddresses'
import { utils } from 'ethers'
import { trim } from 'helpers/trim'
import { ContentLarge } from 'styles/typography'
import Button from 'components/Button'
import { BUY_CLAM_LINK } from 'constant'

const StyledClamBalance = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  background-color: white;
  border: 4px solid ${({ theme }) => theme.colors.otterBlack};
  border-radius: 10px;
  padding: 8px;
  gap: 8px;
`

const StyledClamBalanceText = styled(ContentLarge)`
  display: flex;
  align-items: center;
  &:before {
    content: '';
    background-image: url(${CLAM});
    background-size: contain;
    background-repeat: no-repeat;
    width: 40px;
    height: 40px;
    margin-right: 10px;
    display: block;
  }
`

export default function ClamBalance() {
  const { account, chainId } = useEthers()
  const { CLAM } = useContractAddresses()
  const clamBalance = useTokenBalance(CLAM, account, { chainId }) || 0
  return (
    <a href={BUY_CLAM_LINK} target="_blank" rel="noreferrer">
      <StyledClamBalance>
        <StyledClamBalanceText>{account ? trim(utils.formatUnits(clamBalance, 9), 2) : '-'}</StyledClamBalanceText>
        <Button padding="0px 10px" primaryColor="pink">
          <ContentLarge>+</ContentLarge>
        </Button>
      </StyledClamBalance>
    </a>
  )
}
