import OttoDialog from 'components/OttoDialog'
import { useApi } from 'contexts/Api'
import { Forge } from 'models/Forge'
import { useTranslation } from 'next-i18next'
import { useEffect, useState } from 'react'
import styled from 'styled-components/macro'
import { ContentExtraSmall, Headline } from 'styles/typography'
import ForgeList from './ForgeList'

const StyledHeader = styled.div`
  height: 520px;
`

const StyledDialog = styled(OttoDialog)`
  max-width: 378px;
`

export default function FoundryView() {
  const api = useApi()
  const [forges, setForges] = useState<Forge[]>([])
  const { t } = useTranslation('', { keyPrefix: 'foundry' })

  useEffect(() => {
    api
      .getFoundryForges()
      .then(setForges)
      .catch(err => {
        console.warn(err)
      })
  }, [api])

  return (
    <div>
      <StyledHeader>
        <StyledDialog>
          <Headline>{t('dialog.title')}</Headline>
          <ContentExtraSmall>{t('dialog.content')}</ContentExtraSmall>
        </StyledDialog>
      </StyledHeader>
      <ForgeList forges={forges} />
    </div>
  )
}
