import { useTranslation } from 'next-i18next'
import { useState } from 'react'
import Button, { ButtonProps } from './Button'

export default function CopyButton({ value, ...props }: ButtonProps & { value: string }) {
  const { t } = useTranslation()
  const [copied, setCopied] = useState(false)

  const copy = () => {
    navigator.clipboard.writeText(value)
    setCopied(true)
  }

  return (
    <Button {...props} onClick={copy}>
      {t(copied ? 'copied' : 'copy')}
    </Button>
  )
}
