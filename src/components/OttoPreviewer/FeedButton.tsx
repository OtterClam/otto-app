import { useTranslation } from 'next-i18next'
import styled from 'styled-components/macro'
import { Note } from 'styles/typography'

const StyledButton = styled(Note).attrs({ as: 'button' })<{ disabled: boolean; hide: boolean }>`
  display: flex;
  padding: 2px;
  border: 1px ${({ theme }) => theme.colors.otterBlack} solid;
  background: ${({ theme, hide }) => (hide ? theme.colors.darkGray100 : theme.colors.rarity.C1)};
  border-radius: 2px;
  width: 40px;
  height: 40px;

  &::before {
    content: attr(data-label);
    width: 34px;
    height: 34px;
    padding: 2px 0;
    box-sizing: border-box;
    text-align: center;
    line-height: 15px;
    color: ${({ theme }) => theme.colors.white};
    background: ${({ theme }) => theme.colors.otterBlack};
  }
`

export default function FeedButton({ hide = false }: { hide?: boolean }) {
  const { t } = useTranslation('', { keyPrefix: 'ottoPreviewer' })

  return <StyledButton disabled={hide} data-label={hide ? '' : t('feedButton')} hide={hide} />
}
