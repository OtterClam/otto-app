import BorderContainer from 'components/BorderContainer'
import Countdown from 'components/Countdown'
import ItemCell from 'components/ItemCell'
import { format } from 'date-fns'
import { FlashSellResponse } from 'libs/api'
import { useTranslation } from 'next-i18next'
import styled from 'styled-components/macro'
import { Caption, ContentSmall } from 'styles/typography'
import ProductCard from './ProductCard'

const StyledContainer = styled(BorderContainer)`
  padding: 40px;
  background: ${({ theme }) => theme.colors.darkGray400};
  display: flex;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    padding: 20px;
    flex-direction: column;
  }
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

const StyledItemCell = styled(ItemCell)`
  @media ${({ theme }) => theme.breakpoints.mobile} {
    width: 90px;
    height: 90px;
  }
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

const DATE_TIME_FORMAT = 'MMM dd hh:mm aa'

export default function FlashSellInfo({
  flashSell: { type, products, special_items, start_time, end_time },
  onClick,
}: Props) {
  const { t } = useTranslation('', { keyPrefix: 'store.flash_sell' })
  const start = format(new Date(start_time), DATE_TIME_FORMAT)
  const end = format(new Date(end_time), DATE_TIME_FORMAT)
  const started = Date.now() >= start_time

  return (
    <StyledContainer>
      <ProductCard
        product={products[0]}
        enabled={started}
        button={started ? t('select') : t('coming_soon')}
        onClick={onClick}
      />
      <StyledRightContainer>
        <StyledFlashSellItemsText>{t('contain_items')}</StyledFlashSellItemsText>
        <StyledItemList>
          {special_items.map((item, index) => (
            <StyledItemContainer key={index}>
              <StyledItemCell metadata={item} />
              <StyledItemName>
                {item.name}
                {item.stats[type.toLocaleUpperCase()] && (
                  <StyledItemHint>
                    {`${type.toLocaleUpperCase()}: ${item.stats[type.toLocaleUpperCase()] ?? 0}`}
                  </StyledItemHint>
                )}
              </StyledItemName>
            </StyledItemContainer>
          ))}
        </StyledItemList>
        <StyledSellRange>{t('sell_range', { start, end })}</StyledSellRange>
        {started && (
          <StyledCountdownContainer>
            <Countdown target={end_time} />
          </StyledCountdownContainer>
        )}
      </StyledRightContainer>
    </StyledContainer>
  )
}
