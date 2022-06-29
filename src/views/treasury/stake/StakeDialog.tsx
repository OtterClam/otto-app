import { useTranslation } from 'next-i18next'
import styled from 'styled-components'
import { Caption, ContentLarge, ContentMedium, ContentSmall, Headline } from 'styles/typography'
import CLAM from 'assets/clam.svg'
import { utils } from 'ethers'
import { trim } from 'helpers/trim'
import useClamBalance from 'hooks/useClamBalance'
import Button from 'components/Button'
import CLAMCoin from 'assets/icons/CLAM.svg'

const StyledStakeDialog = styled.div``

const StyledTabs = styled.div`
  display: flex;
  gap: 10px;
  justify-content: space-around;
  padding: 0 20px;
  position: relative;
`

const StyledTab = styled(ContentMedium).attrs({ as: 'button' })<{ selected?: boolean }>`
  position: relative;
  bottom: -4px;
  padding: 10px 0;
  flex: 1;
  border: 4px solid ${({ theme }) => theme.colors.otterBlack};
  background-color: ${({ theme, selected }) => (selected ? '#FFC737' : theme.colors.white)};
  box-shadow: ${({ selected }) =>
    selected
      ? 'inset 0px -8px 0px #d88335, inset 0px 0px 0px 6px rgba(255, 255, 255, 0.4)'
      : 'inset 0px -8px 0px rgba(0, 0, 0, 0.2), inset 0px 0px 0px 6px rgba(255, 255, 255, 0.4)'};
  border-radius: 8px 8px 0px 0px;
`

const StyledBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
  border: 4px solid ${({ theme }) => theme.colors.otterBlack};
  border-radius: 20px;
  background: ${({ theme }) => theme.colors.white};
`

const StyledClamBalance = styled(Caption)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 5px;
`

const StyledClamBalanceText = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  &:before {
    content: '';
    background: no-repeat center/contain url(${CLAM.src});
    width: 16px;
    height: 16px;
    margin-right: 5px;
    display: block;
  }
`

const StyledClamInput = styled(ContentSmall).attrs({ as: 'input' })`
  width: 100%;
  padding: 20px;
  border: 4px solid ${({ theme }) => theme.colors.otterBlack};
  border-radius: 10px;
  background: url(${CLAMCoin.src}) no-repeat 20px;
  text-indent: 32px;

  ::placeholder {
    color: ${({ theme }) => theme.colors.lightGray400};
    opacity: 1;
  }
`

const StyledButton = styled(Button)``

// type Tab = 'stake' | 'unstake'

export default function StakeDialog() {
  const { t } = useTranslation('', { keyPrefix: 'stake' })
  const clamBalance = useClamBalance()
  return (
    <StyledStakeDialog>
      <StyledTabs>
        <StyledTab selected>{t('stake_tab')} </StyledTab>
        <StyledTab>{t('unstake_tab')} </StyledTab>
      </StyledTabs>
      <StyledBody>
        <Headline as="h1">{t('welcome')}</Headline>
        <ContentSmall as="p">{t('desc')}</ContentSmall>
        <StyledClamBalance>
          {t('available')}
          <StyledClamBalanceText>
            {clamBalance !== undefined ? trim(utils.formatUnits(clamBalance, 9), 2) : '-'}
          </StyledClamBalanceText>
          <Button Typography={ContentLarge} primaryColor="white" padding="0 12px">
            {t('max')}
          </Button>
        </StyledClamBalance>
        <StyledClamInput placeholder={t('input_placeholder')} />
        <StyledButton Typography={Headline} padding="6px">
          {t('stake_btn')}
        </StyledButton>
      </StyledBody>
    </StyledStakeDialog>
  )
}
