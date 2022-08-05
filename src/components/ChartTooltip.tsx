import styled from 'styled-components/macro'
import { ContentExtraSmall, ContentMedium, Note } from 'styles/typography'

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  background: ${({ theme }) => theme.colors.white};
  padding: 12px;
  border-radius: 8px;
  border: 1px ${({ theme }) => theme.colors.lightGray400} solid;
  white-space: nowrap;
`

const StyledHeader = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  gap: 5px;
`

const StyledHeaderLabel = styled(ContentMedium)`
  flex: 2;
`

const StyledHeaderValue = styled(ContentMedium)`
  flex: 1;
  text-align: right;
`

const StyledFooter = styled(ContentExtraSmall)`
  font-weight: bold;
`

const StyledList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 5px;
  list-style: none;
  margin: 0;
  padding: 0;
`

const StyledItem = styled.li<{ color: string }>`
  display: flex;
  align-items: center;
  flex-wrap: nowrap;
  gap: 5px;

  &::before {
    content: '';
    display: block;
    width: 8px;
    height: 8px;
    background: ${props => props.color};
    border-radius: 4px;
    margin-right: 2px;
  }
`

const StyledItemLabel = styled(Note)`
  flex: 2;
`

const StyledItemValue = styled(Note)`
  flex: 1;
  text-align: right;
`

export interface ChartTooltipProps {
  headerLabel?: string
  headerValue?: string | number
  items: {
    key: string
    color: string
    label: string
    value: string | number
  }[]
  footer?: string
}

export default function ChartTooltip({ headerLabel, headerValue, items = [], footer }: ChartTooltipProps) {
  return (
    <StyledContainer>
      {(headerLabel || headerValue) && (
        <StyledHeader>
          {headerLabel && <StyledHeaderLabel>{headerLabel}</StyledHeaderLabel>}
          {headerValue && <StyledHeaderValue>{headerValue}</StyledHeaderValue>}
        </StyledHeader>
      )}
      <StyledList>
        {items.map(item => (
          <StyledItem key={item.key} color={item.color}>
            <StyledItemLabel>{item.label}:</StyledItemLabel>
            <StyledItemValue>{item.value}</StyledItemValue>
          </StyledItem>
        ))}
      </StyledList>
      {footer && <StyledFooter>{footer}</StyledFooter>}
    </StyledContainer>
  )
}
