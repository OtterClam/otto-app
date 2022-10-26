import Ribbon from 'assets/ui/ribbon.svg'
import ItemCell from 'components/ItemCell'
import Item, { ItemMetadata } from 'models/Item'
import { useTranslation } from 'next-i18next'
import styled, { keyframes } from 'styled-components/macro'
import { ContentMedium, ContentSmall } from 'styles/typography'

const ZoomInUp = keyframes`
  from {
    opacity: 0;
    transform: scale3d(0.1, 0.1, 0.1) translate3d(0, 1000px, 0);
    animation-timing-function: cubic-bezier(0.55, 0.055, 0.675, 0.19);
  }

  60% {
    opacity: 1;
    transform: scale3d(0.475, 0.475, 0.475) translate3d(0, -60px, 0);
    animation-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1);
  }
`
const FadeInDown = keyframes`
  from {
    opacity: 0;
    transform: translate3d(0, 100%, 0);
  }

  50% {
    opacity: 0;
    transform: translate3d(0, 100%, 0);
  }

  100% {
    opacity: 1;
    transform: translate3d(0, 0, 0);
  }
`

const StyledOpenItemAnimation = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`

const StyledRibbonText = styled.div`
  min-width: 223px;
  min-height: 53px;
  text-align: center;
  color: ${({ theme }) => theme.colors.white};
  background-image: url(${Ribbon.src});
  padding-top: 6px;

  animation: ${ZoomInUp} 1.5s;
`

const StyledItemCell = styled(ItemCell)`
  animation: ${ZoomInUp} 2s;
`

const StyledNameSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: ${FadeInDown} 1.5s;
`

const StyledCategory = styled(ContentSmall)<{ type: string }>`
  display: flex;
  align-items: center;
  width: fit-content;
  color: ${({ theme }) => theme.colors.crownYellow};

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

const StyledName = styled(ContentMedium)``

interface Props {
  current: number
  total: number
  item: ItemMetadata
  className?: string
}

export default function OpenItemAnimation({ current, total, item, className }: Props) {
  const { t } = useTranslation()
  return (
    <StyledOpenItemAnimation className={className}>
      <StyledRibbonText>
        <ContentSmall>{t('store.popup.found_items', { current, total })}</ContentSmall>
      </StyledRibbonText>
      <StyledItemCell metadata={item} />
      <StyledNameSection>
        <StyledCategory type={item.type}>{t(`my_items.section_title.${item.type}`)} </StyledCategory>
        <StyledName as="h2">{item.name}</StyledName>
      </StyledNameSection>
    </StyledOpenItemAnimation>
  )
}
