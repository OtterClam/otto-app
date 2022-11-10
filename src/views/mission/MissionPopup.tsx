import { useEthers } from '@usedapp/core'
import Button from 'components/Button'
import CloseButton from 'components/CloseButton'
import Fullscreen from 'components/Fullscreen'
import PaymentButton from 'components/PaymentButton'
import { Token } from 'constant'
import { useApi, useApiCall } from 'contexts/Api'
import { intervalToDuration } from 'date-fns'
import useContractAddresses from 'hooks/useContractAddresses'
import { Mission } from 'models/Mission'
import { useTranslation } from 'next-i18next'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { hideMissionPopup, selectShowMissionPopup } from 'store/uiSlice'
import styled from 'styled-components/macro'
import { ContentLarge, Headline, Note } from 'styles/typography'
import { formatDuration } from 'utils/duration'
import HeadLeft from './head-left.png'
import HeadRight from './head-right.png'
import MissionList from './MissionList'
import NewMissionPopup from './NewMissionPopup'

const StyledMissionPopup = styled.div`
  min-height: 90vh;
  max-width: 428px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 10px;
  color: white;
  background: ${({ theme }) => theme.colors.lightGray300};
  border-radius: 10px;
  border: 2px solid ${({ theme }) => theme.colors.otterBlack};
  overflow: hidden;
`

const StyledTitle = styled(Headline).attrs({ as: 'h2' })`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.otterBlack};
  gap: 10px;
  padding: 15px;
`

const StyledListContainer = styled.div`
  width: 100%;
  height: calc(90vh - 156px);
  overflow: scroll;
`

const StyledCloseButton = styled(CloseButton)`
  position: absolute;
  top: 18px;
  right: 24px;
`

const StyledNewMissionSection = styled.section`
  width: 100%;
  padding: 10px 20px;
  gap: 10px;
  border-top: 2px solid ${({ theme }) => theme.colors.otterBlack};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.otterBlack};
  background: ${({ theme }) => theme.colors.white};
`

const StyledNote = styled(Note)`
  display: flex;
`

function Countdown({ target }: { target: Date }) {
  const { t } = useTranslation('', { keyPrefix: 'mission' })
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date())
    }, 1000)
    return () => clearInterval(interval)
  }, [target])
  const time = formatDuration(
    intervalToDuration({
      start: now,
      end: target,
    })
  )
  return <StyledNote>{t('next_mission', { time })}</StyledNote>
}

export default function MissionPopup() {
  const { t } = useTranslation('', { keyPrefix: 'mission' })
  const { OTTOPIA_STORE } = useContractAddresses()
  const showPopup = useSelector(selectShowMissionPopup)
  const dispatch = useDispatch()
  const { account } = useEthers()
  const api = useApi()
  const [newMission, setNewMission] = useState<Mission | null>(null)
  const [newMissionRequesting, setNewMissionRequesting] = useState(false)
  const { result: info, refetch } = useApiCall('getNewMissionInfo', [{ account: account ?? '' }], Boolean(account), [
    account,
  ])
  const requestNewMissionFree = async () => {
    setNewMissionRequesting(true)
    const newMission = await api.requestNewMission({
      account: account ?? '',
    })
    setNewMission(newMission)
    refetch()
    setNewMissionRequesting(false)
  }
  return (
    <Fullscreen width="428px" show={showPopup}>
      <StyledMissionPopup>
        <StyledCloseButton color="white" onClose={() => dispatch(hideMissionPopup())} />
        <StyledTitle>
          <Image src={HeadLeft} width={32} height={32} />
          {t('title')}
          <Image src={HeadRight} width={32} height={32} />
        </StyledTitle>
        <StyledListContainer>
          <MissionList />
        </StyledListContainer>
        {info && (
          <StyledNewMissionSection>
            {info.price !== '0' && (
              <>
                <Countdown target={info.nextFreeMissionAt} />
                <PaymentButton
                  Typography={ContentLarge}
                  width="100%"
                  amount={info.price}
                  token={Token.Clam}
                  spenderAddress={OTTOPIA_STORE}
                >
                  {t('new_mission_btn')}
                </PaymentButton>
              </>
            )}
            {info.price === '0' && (
              <Button
                Typography={ContentLarge}
                width="100%"
                loading={newMissionRequesting}
                onClick={requestNewMissionFree}
              >
                {t('new_mission_btn_free')}
              </Button>
            )}
          </StyledNewMissionSection>
        )}
        {newMission && <NewMissionPopup mission={newMission} onClose={() => setNewMission(null)} />}
      </StyledMissionPopup>
    </Fullscreen>
  )
}
