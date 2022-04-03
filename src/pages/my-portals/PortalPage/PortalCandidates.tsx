import useApi, { OttoCandidateMeta } from 'hooks/useApi'
import Portal from 'models/Portal'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { Headline } from 'styles/typography'
import OttoCandidateCard from './OttoCandidateCard'

interface Props {
  portal: Portal
}

const StyledPortalCandidates = styled.div``

const StyledTitle = styled.p`
  margin: 40px 0;
  text-align: center;
`

const StyledCandidates = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 25px;
`

const StyledCandidateItem = styled.div`
  width: 265px;
  height: 496px;
`

export default function PortalCandidates({ portal }: Props) {
  const { t } = useTranslation()
  const api = useApi()
  const [candidates, setCandidates] = useState<OttoCandidateMeta[]>([])
  useEffect(() => {
    api.getPortalCandidates(portal.tokenId).then(setCandidates)
  }, [portal])

  return (
    <StyledPortalCandidates>
      <StyledTitle>
        <Headline>{t('portal.candidates_title')}</Headline>
      </StyledTitle>
      <StyledCandidates>
        {candidates.map((candidate, index) => (
          <StyledCandidateItem key={index}>
            <OttoCandidateCard
              onSummon={() => {
                console.log(`summon${index}`)
              }}
              {...candidate}
            />
          </StyledCandidateItem>
        ))}
      </StyledCandidates>
    </StyledPortalCandidates>
  )
}
