import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import { useRouter } from 'next/router'
import styled from 'styled-components/macro'
import { ContentSmall } from 'styles/typography'
import SelectButton from './SelectButton'

const StyledLanguagePicker = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
`

const StyledHeader = styled.p``
const languages = ['en', 'zh-tw']

export default function LanguagePicker() {
  const router = useRouter()
  const { t, i18n } = useTranslation()

  return (
    <StyledLanguagePicker>
      <StyledHeader>
        <ContentSmall>{t('side_menu.select_language')}</ContentSmall>
      </StyledHeader>
      {languages.map(locale => (
        <Link
          key={locale}
          href={{
            pathname: router.pathname,
            query: router.query,
          }}
          locale={locale}
        >
          <SelectButton
            title={t(`languages.${locale}`)}
            selected={i18n.resolvedLanguage === locale}
            onClick={() => i18n.changeLanguage(locale)}
          />
        </Link>
      ))}
    </StyledLanguagePicker>
  )
}
