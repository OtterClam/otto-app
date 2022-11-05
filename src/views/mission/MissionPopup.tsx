import Button from 'components/Button'
import CloseButton from 'components/CloseButton'
import Fullscreen from 'components/Fullscreen'
import Help from 'components/Help'
import HelpButton from 'components/HelpButton'
import PaymentButton from 'components/PaymentButton'
import { useTranslation } from 'next-i18next'
import Image from 'next/image'
import { useDispatch, useSelector } from 'react-redux'
import { hideMissionPopup, selectShowMissionPopup } from 'store/uiSlice'
import styled from 'styled-components/macro'
import { ContentLarge, Headline, Note } from 'styles/typography'
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

export default function MissionPopup() {
  const { t } = useTranslation('', { keyPrefix: 'mission' })
  const showPopup = useSelector(selectShowMissionPopup)
  const dispatch = useDispatch()
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
        <StyledNewMissionSection>
          <StyledNote>{t('next_mission', { time: '03:20:20' })}</StyledNote>
          <Button Typography={ContentLarge} width="100%">
            {t('new_mission_btn_free')}
          </Button>
        </StyledNewMissionSection>
      </StyledMissionPopup>
    </Fullscreen>
  )
}
