import { useApi } from 'contexts/Api'
import { OttoCandidateMeta } from 'libs/api'
import Portal from 'models/Portal'
import { useEffect, useState } from 'react'
import { useTranslation } from 'next-i18next'
import styled from 'styled-components/macro'
import { Headline } from 'styles/typography'
import OttoCandidateCard from './OttoCandidateCard'

const StyledPortalCandidates = styled.div``

const StyledTitle = styled.p`
  margin: 40px 0;
  text-align: center;
`

const StyledCandidates = styled.div`
  display: grid;
  justify-content: center;
  align-items: center;
  justify-items: center;
  gap: 15px;
  grid-template-columns: repeat(auto-fit, 265px);
`

const StyledCandidateItem = styled.div`
  width: 265px;
`

interface Props {
  portal: Portal
  onSummon: (index: number) => void
}

export default function PortalCandidates({ portal, onSummon }: Props) {
  const { t } = useTranslation()
  const api = useApi()
  const [candidates, setCandidates] = useState<OttoCandidateMeta[]>([])
  useEffect(() => {
    api.getPortalCandidates(portal.tokenId).then(setCandidates)
  }, [portal, api])

  return (
    <StyledPortalCandidates>
      <StyledTitle>
        <Headline>{t('portal.candidates_title')}</Headline>
      </StyledTitle>
      <StyledCandidates>
        {candidates.map((candidate, index) => (
          <StyledCandidateItem key={index}>
            <OttoCandidateCard onSummon={() => onSummon(index)} {...candidate} />
          </StyledCandidateItem>
        ))}
      </StyledCandidates>
    </StyledPortalCandidates>
  )
}
