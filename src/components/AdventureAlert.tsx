import useBrowserLayoutEffect from 'hooks/useBrowserLayoutEffect'
import noop from 'lodash/noop'
import { useTranslation } from 'next-i18next'
import { ReactNode, useCallback, useState } from 'react'
import styled from 'styled-components/macro'
import { ContentMedium, ContentSmall } from 'styles/typography'
import AdventureFullscreen from 'components/AdventureFullscreen'
import Button from 'components/Button'

const StyledFullscreen = styled(AdventureFullscreen)`
  max-width: 300px !important;
  color: ${({ theme }) => theme.colors.otterBlack} !important;
  background: ${({ theme }) => theme.colors.white} !important;
  text-align: center;

  .adventure-alert-inner {
    padding: 20px 15px;
  }
`

const StyledHTMLCheckbox = styled.input.attrs({ type: 'checkbox' })`
  opacity: 0;
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
`

const StyledCheckboxContainer = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
  align-items: center;
  position: relative;
  cursor: pointer;
`

const StyledCheckbox = styled.div<{ checked: boolean }>`
  position: relative;
  width: 24px;
  height: 24px;
  border: 2px ${({ theme, checked }) => (checked ? theme.colors.otterBlue : theme.colors.lightGray200)} solid;
  border-radius: 12px;

  ${({ checked, theme }) =>
    checked &&
    `
    &::after {
      content: '';
      border-radius: 3px;
      width: 6px;
      height: 6px;
      background: ${theme.colors.otterBlue};
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-3px, -3px);
    }
  `}
`

const StyledContainer = styled(ContentSmall)`
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 10px;
`

export interface AdventureAlertProps {
  storageKey: string
  show?: boolean
  content: ReactNode
  okLabel: string
  cancelLabel: string
  onOk?: () => void
  onCancel?: () => void
}

export default function AdventureAlert({
  storageKey,
  show,
  content,
  okLabel,
  cancelLabel,
  onOk = noop,
  onCancel = noop,
}: AdventureAlertProps) {
  const [doNotShow, setDoNotShow] = useState(true)
  const [checked, setChecked] = useState(false)
  const { t } = useTranslation('', { keyPrefix: 'adventureAlert' })
  const key = `adventureAlert.${storageKey}`

  useBrowserLayoutEffect(() => {
    const savedAction = localStorage.getItem(key)
    setDoNotShow(Boolean(savedAction))

    if (savedAction === 'ok' && show) {
      onOk()
    }
  }, [storageKey, show])

  const ok = () => {
    if (checked) {
      localStorage.setItem(key, 'ok')
      setDoNotShow(true)
    }
    onOk()
  }

  return (
    <StyledFullscreen hideCloseButton show={!doNotShow && show} bodyClassName="adventure-alert-inner">
      <StyledContainer>
        {content}
        <Button width="100%" padding="2px 0" Typography={ContentMedium} onClick={ok}>
          {okLabel}
        </Button>
        <Button width="100%" padding="2px 0" Typography={ContentMedium} primaryColor="white" onClick={onCancel}>
          {cancelLabel}
        </Button>
        <StyledCheckboxContainer>
          <StyledCheckbox checked={checked} />
          <StyledHTMLCheckbox checked={checked} onChange={() => setChecked(state => !state)} />
          {t('hideDesc')}
        </StyledCheckboxContainer>
      </StyledContainer>
    </StyledFullscreen>
  )
}
