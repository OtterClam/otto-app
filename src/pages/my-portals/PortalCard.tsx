import axios from 'axios'
import BorderContainer from 'components/BorderContainer'
import ProgressBar from 'components/ProgressBar'
import { formatDuration, intervalToDuration } from 'date-fns'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { theme } from 'styles'
import { Caption, ContentMedium, ContentSmall } from 'styles/typography'
import ClockImage from './clock.png'
import { ListMyPortals_ottos } from './__generated__/ListMyPortals'

const StyledPortalCard = styled(BorderContainer)`
  width: 265px;
  height: 448px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 15px;
  gap: 12px;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    width: 100%;
    height: 363px;
    padding: 8px 5px;
    gap: 8px;
  }
`

const StyledPortalImage = styled.img`
  width: 225px;
  height: 225px;
  border: 4px solid ${({ theme }) => theme.colors.otterBlack};

  @media ${({ theme }) => theme.breakpoints.mobile} {
    width: 90%;
    height: unset;
  }
`

const StyledPortalTitle = styled.div``

const StyledPortalStatus = styled.div``

const StyledCountdown = styled.div`
  width: 90%;
  display: flex;
  color: ${({ theme }) => theme.colors.darkGray200};
  align-items: center;

  &::before {
    content: '';
    background: url(${ClockImage});
    background-size: contain;
    background-repeat: no-repeat;
    width: 21px;
    height: 21px;
    margin-right: 10px;
    display: block;
  }
`

const StyledProgressBar = styled(ProgressBar)`
  width: 90%;
  border-radius: 6px;
`

interface Props {
  portal: ListMyPortals_ottos
}

interface PortalMeta {
  name: string
  image: string
}

export default function PortalCard({ portal: { tokenURI, portalStatus, canSummonAt } }: Props) {
  const { t } = useTranslation()
  const [now, setNow] = useState(Date.now())
  const [portalMeta, setPortalMeta] = useState<PortalMeta | null>(null)
  const openProgress = useMemo(
    () => Math.round(((Number(canSummonAt) - now) / (7 * 86400 * 1000)) * 100),
    [canSummonAt, now]
  )
  const duration = useMemo(
    () =>
      formatDuration(
        intervalToDuration({
          start: now,
          end: Number(canSummonAt),
        })
      ),
    [canSummonAt, now]
  )

  useEffect(() => {
    axios.get<PortalMeta>(tokenURI).then(res => {
      setPortalMeta(res.data)
    })
  }, [tokenURI])
  useEffect(() => {
    setTimeout(() => setNow(Date.now()), 1000)
  }, [now])

  return (
    <StyledPortalCard borderColor={theme.colors.clamPink}>
      <StyledPortalImage src={portalMeta?.image} />
      <StyledPortalTitle>
        <ContentMedium>{portalMeta?.name}</ContentMedium>
      </StyledPortalTitle>
      <StyledPortalStatus>
        <ContentSmall>{t(`my_portals.status.${portalStatus}`)}</ContentSmall>
      </StyledPortalStatus>
      <StyledProgressBar height="12px" progress={openProgress} />
      <StyledCountdown>
        <Caption>{t('my_portals.open_duration', { duration })}</Caption>
      </StyledCountdown>
    </StyledPortalCard>
  )
}
