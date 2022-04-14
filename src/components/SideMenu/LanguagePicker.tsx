import { languages } from 'i18n'
import { useTranslation } from 'react-i18next'
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

export default function LanguagePicker() {
  const { t, i18n } = useTranslation()
  return (
    <StyledLanguagePicker>
      <StyledHeader>
        <ContentSmall>{t('side_menu.select_language')}</ContentSmall>
      </StyledHeader>
      {languages.map(({ name, locale }) => (
        <SelectButton
          key={locale}
          title={name}
          selected={i18n.resolvedLanguage === locale}
          onClick={() => i18n.changeLanguage(locale)}
        />
      ))}
    </StyledLanguagePicker>
  )
}
