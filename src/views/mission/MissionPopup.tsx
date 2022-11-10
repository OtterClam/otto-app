import { useEthers } from '@usedapp/core'
import Button from 'components/Button'
import CloseButton from 'components/CloseButton'
import Fullscreen from 'components/Fullscreen'
import PaymentButton from 'components/PaymentButton'
import { Token } from 'constant'
import { useApi, useApiCall } from 'contexts/Api'
import { useRequestNewMission } from 'contracts/functions'
import { intervalToDuration } from 'date-fns'
import useContractAddresses from 'hooks/useContractAddresses'
import { MissionFilter } from 'libs/api'
import { Mission } from 'models/Mission'
import { useMyOttos } from 'MyOttosProvider'
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
import { useMyMissions } from './MyMissionsProvider'
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

const StyledReachLimit = styled(Note).attrs({ as: 'p' })`
  color: ${({ theme }) => theme.colors.darkGray200};
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
  const [newMissionRequesting, setNewMissionRequesting] = useState(false)
  const { ottos: myOttos } = useMyOttos()
  const { info, missions, filter, newMission, setNewMission } = useMyMissions()
  const reachedLimit = missions.length === myOttos.length
  const requestNewMissionFree = async () => {
    setNewMissionRequesting(true)
    const newMission = await api.requestNewMission({
      account: account ?? '',
    })
    setNewMissionRequesting(false)
    setNewMission(newMission)
  }
  const { buyState, buy, resetBuy } = useRequestNewMission()
  const onRequestNewMission = async () => {
    if (info) {
      buy(info.newProductId)
    }
  }
  useEffect(() => {
    if (buyState.state === 'Fail') {
      alert(buyState.status.errorMessage)
      resetBuy()
    } else if (buyState.state === 'Success' && buyState.mission) {
      setNewMission(buyState.mission)
      resetBuy()
    }
  }, [buyState])
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
        {filter !== 'finished' && info && (
          <StyledNewMissionSection>
            {info.newPrice !== '0' && (
              <>
                <Countdown target={info.nextFreeMissionAt} />
                <PaymentButton
                  Typography={ContentLarge}
                  disabled={reachedLimit}
                  width="100%"
                  amount={info.newPrice}
                  token={Token.Clam}
                  spenderAddress={OTTOPIA_STORE}
                  loading={buyState.state === 'Processing'}
                  onClick={onRequestNewMission}
                >
                  {t('new_mission_btn')}
                </PaymentButton>
              </>
            )}
            {info.newPrice === '0' && (
              <Button
                Typography={ContentLarge}
                disabled={reachedLimit}
                width="100%"
                loading={newMissionRequesting}
                onClick={requestNewMissionFree}
              >
                {t('new_mission_btn_free')}
              </Button>
            )}
            {reachedLimit && <StyledReachLimit>{t('reached_limit')}</StyledReachLimit>}
          </StyledNewMissionSection>
        )}
        {newMission && <NewMissionPopup mission={newMission} onClose={() => setNewMission(null)} />}
      </StyledMissionPopup>
    </Fullscreen>
  )
}
