import { useTranslation } from 'react-i18next'
import { Display2 } from 'styles/typography'

export default function index() {
  const { t } = useTranslation()
  return (
    <div>
      <p>
        <Display2>{t('mint.intro.title')}</Display2>
      </p>
    </div>
  )
}
