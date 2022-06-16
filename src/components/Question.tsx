import styled from 'styled-components/macro'
import { ContentLarge, Headline } from 'styles/typography'
import Button from 'components/Button'
import { useState } from 'react'
import checked from 'assets/icons/CheckedWhite.svg'
import noop from 'lodash/noop'
import { useTranslation } from 'react-i18next'

interface StyledOptionProps {
  checked: boolean
}

const StyledContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`

const StyledOptions = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, calc(50% - 10px));
  grid-row-gap: 10px;
  grid-column-gap: 20px;
  counter-reset: number;
  margin-bottom: 20px;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    grid-template-columns: repeat(auto-fit, 100%);
  }
`

const StyledOption = styled(ContentLarge.withComponent('button'))<StyledOptionProps>`
  position: relative;
  counter-increment: number;
  background: ${props => (props.checked ? props.theme.colors.otterBlue : 'transparent')};
  border: 1px ${props => props.theme.colors.white} solid;
  border-radius: 8px;
  color: ${props => props.theme.colors.white};
  padding: 6px 50px 6px 10px;
  box-sizing: border-box;
  display: inline-block;
  align-items: center;
  min-height: 50px;
  display: flex;
  align-items: center;

  &:before {
    content: counter(number, upper-alpha) '.';
    display: inline-block;
    margin-right: 0.5em;
  }

  &:after {
    position: absolute;
    right: 15px;
    content: '';
    background: center / cover url(${checked.src});
    width: 20px;
    height: 20px;
    display: ${props => (props.checked ? 'block' : 'none')};
  }
`

export interface QuestionProps {
  options: string[]
  onChange?: (index: number) => void
  defaultValue?: number
}

export function Question({ options, defaultValue, children, onChange = noop }: React.PropsWithChildren<QuestionProps>) {
  const [value, setValue] = useState(defaultValue)
  const select: React.MouseEventHandler<HTMLButtonElement> = e => setValue(Number(e.currentTarget.dataset.value))
  const confirm = () => value !== undefined && onChange(value)
  const { t } = useTranslation()

  return (
    <StyledContainer>
      <div>{children}</div>
      <StyledOptions>
        {options.map((option, index) => (
          <StyledOption onClick={select} data-value={index} checked={value === index} key={index}>
            {option}
          </StyledOption>
        ))}
      </StyledOptions>
      <Button padding="6px 0" disabled={value === undefined} onClick={confirm} Typography={Headline}>
        {t('question.submit_button')}
      </Button>
    </StyledContainer>
  )
}
