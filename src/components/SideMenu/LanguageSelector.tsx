import SelectButton from 'components/SelectButton'
import SelectButtons from 'components/SelectButtons'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { useCallback } from 'react'

export default function LanguageSelector() {
  const router = useRouter()
  const { t } = useTranslation()

  const handleChangeEvent = useCallback(
    (locale: string) => {
      router.push(router.asPath, router.asPath, { locale })
    },
    [router]
  )

  return (
    <SelectButtons value={router.locale ?? router.defaultLocale ?? ''} onChange={handleChangeEvent}>
      {(router.locales ?? []).map(locale => (
        <SelectButton key={locale} value={locale} label={t(`languages.${locale}`)} />
      ))}
    </SelectButtons>
  )
}
