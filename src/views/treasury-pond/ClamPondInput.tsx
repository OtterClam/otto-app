import ArrowDownIcon from 'assets/ui/arrow_down.svg'
import TokenSelector, { TokenInfo } from 'components/TokenSelector'
import { ClamPondToken } from 'contracts/functions'
import { useTranslation } from 'next-i18next'
import styled from 'styled-components/macro'
import { RegularInput } from 'styles/typography'

const StyledInputContainer = styled.div`
  display: flex;
  gap: 10px;
  width: 100%;
  padding: 20px;
  border: 4px solid ${({ theme }) => theme.colors.otterBlack};
  border-radius: 10px;
`

const StyledSelectTokenButton = styled.button<{ icon: string }>`
  display: flex;
  gap: 5px;
  align-items: center;
  border-radius: 14px;
  padding: 2px 5px;

  &::before {
    content: '';
    display: block;
    background: no-repeat url(${({ icon }) => icon});
    background-size: 100% 100%;
    width: 22px;
    height: 22px;
  }

  &::after {
    display: ${({ disabled }) => (disabled ? 'none' : 'block')};
    content: '';
    width: 12px;
    height: 12px;
    background: url(${ArrowDownIcon.src}) no-repeat center/12px 12px;
  }

  &:hover {
    background: ${({ theme, disabled }) => (disabled ? theme.colors.white : theme.colors.lightGray200)};
  }

  &:disabled {
    color: ${({ theme }) => theme.colors.otterBlack};
  }
`

const StyledClamInput = styled(RegularInput)`
  width: 100%;
  text-align: right;

  ::placeholder {
    color: ${({ theme }) => theme.colors.lightGray400};
    opacity: 1;
  }
`

interface Props {
  tokens: Record<ClamPondToken, TokenInfo>
  selectedToken: TokenInfo
  value: string
  onTokenSelected: (token: TokenInfo) => void
  onValueChanged: (amount: string) => void
}

export default function ClamPondInput({ tokens, selectedToken, value, onTokenSelected, onValueChanged }: Props) {
  const { t } = useTranslation('', { keyPrefix: 'stake' })
  return (
    <StyledInputContainer>
      <TokenSelector tokens={tokens} onSelect={onTokenSelected}>
        <StyledSelectTokenButton icon={selectedToken.icon}>{selectedToken.symbol}</StyledSelectTokenButton>
      </TokenSelector>
      <StyledClamInput
        placeholder={t('input_placeholder')}
        value={value}
        type="number"
        onChange={e => onValueChanged(Number.isNaN(e.target.value) ? '' : e.target.value)}
      />
    </StyledInputContainer>
  )
}
