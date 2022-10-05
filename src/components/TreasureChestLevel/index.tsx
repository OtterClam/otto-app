import { useAdventureContractState } from 'contexts/AdventureContractState'
import { useTranslation } from 'next-i18next'
import styled from 'styled-components/macro'
import { ContentExtraSmall, Note } from 'styles/typography'
import iconImage from './icon.png'

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  background: left center / 55px auto url(${iconImage.src}) no-repeat, ${({ theme }) => theme.colors.otterBlack};
  color: ${({ theme }) => theme.colors.white};
  border-radius: 10px;
  padding: 5px 10px 5px 55px;
`

const StyledProgressBar = styled.div<{ progress: number }>`
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: ${({ theme }) => theme.colors.darkGray400};

  &:before {
    content: '';
    border-radius: 3px;
    background: ${({ theme }) => theme.colors.crownYellow};
    width: ${({ progress }) => progress * 100}%;
    transition: width 0.2s;
  }
`

const StyledHead = styled.div`
  display: flex;
`

const StyledTitle = styled(ContentExtraSmall)`
  flex: 1 50%;
`

const StyledValue = styled(Note)`
  flex: 1 50%;
  text-align: right;
`

const StyledDesc = styled(Note)`
  color: ${({ theme }) => theme.colors.lightGray400};
`

export default function TreasureChestLevel({ className }: { className?: string }) {
  const { t } = useTranslation('', { keyPrefix: 'treasueyChestLevel' })
  const { state } = useAdventureContractState()
  const tcp = state.walletTcp.mod(100).toNumber()

  return (
    <StyledContainer className={className}>
      <StyledHead>
        <StyledTitle>{t('title')}</StyledTitle>
        <StyledValue>{t('value', { tcp })}</StyledValue>
      </StyledHead>
      <StyledProgressBar progress={Math.min(1, tcp / 100)} />
      <StyledDesc>{t('desc')}</StyledDesc>
    </StyledContainer>
  )
}
