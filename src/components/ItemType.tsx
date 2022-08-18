import { useTranslation } from 'next-i18next'
import styled from 'styled-components/macro'
import { ContentExtraSmall } from 'styles/typography'

const StyledContainer = styled.div<{ type: string }>`
  display: flex;
  align-items: center;
  width: fit-content;

  &::before {
    content: '';
    display: inline-block;
    width: 21px;
    height: 21px;
    background-size: 21px 21px;
    background-image: url(/trait-icons/${({ type }) => encodeURI(type)}.png);
    margin-right: 5px;
  }
`

export interface ItemTypeProps {
  type: string
  className?: string
}

export default function ItemType({ className, type }: ItemTypeProps) {
  const { t } = useTranslation('', { keyPrefix: 'my_items.section_title' })
  return (
    <StyledContainer className={className} type={type}>
      <ContentExtraSmall className="item-type-label">{t(type)}</ContentExtraSmall>
    </StyledContainer>
  )
}
