import styled from 'styled-components/macro'
import { Note } from 'styles/typography'
import { useCurrency, Currency } from 'contexts/Currency'
import { useRef, useLayoutEffect, useState, RefObject } from 'react'

const StyledContainer = styled.div<{ bgLeft: number; bgWidth: number }>`
  position: relative;
  z-index: 0;
  display: flex;
  align-items: center;
  height: 36px;
  flex-wrap: nowrap;
  background: ${({ theme }) => theme.colors.lightGray300};
  border-radius: 10px;

  &::before {
    content: '';
    position: absolute;
    top: 4px;
    left: 4px;
    height: 28px;
    width: ${props => props.bgWidth - 8}px;
    border-radius: 6px;
    transform: translate(${props => props.bgLeft}px);
    background: ${({ theme }) => theme.colors.white};
    z-index: -1;
    transition: transform 0.2s;
  }
`

const StyledButton = styled(Note).attrs({ as: 'label' })`
  display: flex;
  align-items: center;
  padding: 0 10px;
  height: 28px;
  white-space: nowrap;
  cursor: pointer;
  user-select: none;

  input {
    display: none;
  }
`

export default function CurrencySwitcher() {
  const containerRef = useRef<HTMLDivElement>() as RefObject<HTMLDivElement>
  const { currency, setCurrency } = useCurrency()
  const [size, setSize] = useState({ left: 0, width: 0 })

  useLayoutEffect(() => {
    if (!containerRef.current) {
      return
    }
    const containerRect = containerRef.current.getBoundingClientRect()
    const rect = containerRef.current.querySelector(`[data-key="${currency}"]`)?.getBoundingClientRect()
    setSize({
      left: (rect?.left ?? 0) - containerRect.left,
      width: rect?.width ?? 0,
    })
  }, [currency, containerRef.current])

  return (
    <StyledContainer bgLeft={size?.left ?? 0} bgWidth={size?.width ?? 0} ref={containerRef}>
      <StyledButton data-key={Currency.CLAM}>
        CLAM
        <input
          name="currency"
          type="radio"
          checked={currency === Currency.CLAM}
          value={Currency.CLAM}
          onChange={() => setCurrency(Currency.CLAM)}
        />
      </StyledButton>
      <StyledButton data-key={Currency.USD}>
        USD
        <input
          name="currency"
          type="radio"
          checked={currency === Currency.USD}
          value={Currency.USD}
          onChange={() => setCurrency(Currency.USD)}
        />
      </StyledButton>
    </StyledContainer>
  )
}
