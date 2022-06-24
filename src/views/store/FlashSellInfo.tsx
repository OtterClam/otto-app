import BorderContainer from 'components/BorderContainer'
import Countdown from 'components/Countdown'
import ItemCell from 'components/ItemCell'
import { format } from 'date-fns'
import { FlashSellResponse } from 'hooks/useApi'
import { useTranslation } from 'next-i18next'
import styled from 'styled-components/macro'
import { Caption, ContentSmall } from 'styles/typography'
import ProductCard from './ProductCard'

const StyledContainer = styled(BorderContainer)`
  padding: 40px;
  background: ${({ theme }) => theme.colors.darkGray400};
  display: flex;
`

const StyledRightContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  gap: 20px;
`

const StyledFlashSellItemsText = styled(ContentSmall)``

const StyledItemList = styled.div`
  display: flex;
  gap: 10px;
`

const StyledItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
`

const StyledItemName = styled(Caption).attrs({ as: 'div' })`
  text-align: center;
`

const StyledItemHint = styled(Caption).attrs({ as: 'p' })`
  color: ${({ theme }) => theme.colors.crownYellow};
`

const StyledSellRange = styled(ContentSmall)``

const StyledCountdownContainer = styled.div``

interface Props {
  flashSell: FlashSellResponse
  onClick: () => void
}

const DATE_TIME_FORMAT = 'MMM dd hh:mm:ss aa'

export default function FlashSellInfo({
  flashSell: { products, special_items, start_time, end_time },
  onClick,
}: Props) {
  const { t } = useTranslation('', { keyPrefix: 'store.flash_sell' })
  const start = format(new Date(start_time), DATE_TIME_FORMAT)
  const end = format(new Date(end_time), DATE_TIME_FORMAT)
  return (
    <StyledContainer>
      <ProductCard product={products[0]} onClick={onClick} />
      <StyledRightContainer>
        <StyledFlashSellItemsText>{t('contain_items')}</StyledFlashSellItemsText>
        <StyledItemList>
          {special_items.map((item, index) => (
            <StyledItemContainer key={index}>
              <ItemCell item={item} />
              <StyledItemName>
                {item.name}
                <StyledItemHint>{`LUK: ${item.luck}`}</StyledItemHint>
              </StyledItemName>
            </StyledItemContainer>
          ))}
        </StyledItemList>
        <StyledSellRange>{t('sell_range', { start, end })}</StyledSellRange>
        <StyledCountdownContainer>
          <Countdown target={end_time} />
        </StyledCountdownContainer>
      </StyledRightContainer>
    </StyledContainer>
  )
}
