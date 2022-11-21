import styled from 'styled-components'
import { useRepositories } from 'contexts/Repositories'
import { useEffect, useRef, useState } from 'react'
import { ContentMedium, ContentSmall, Headline, Note } from 'styles/typography'
import { useTranslation } from 'next-i18next'
import Button from 'components/Button'
import OttoPreviewer from 'components/OttoPreviewer'
import useResizeObserver from '@react-hook/resize-observer'
import OttoAdventureLevel from 'components/OttoAdventureLevel'
import OttoAttrs from 'components/OttoAttrs'
import OttoStats from 'components/OttoStats'
import { useOtto } from 'contexts/Otto'
import Otto from 'models/Otto'
import { AdventureOttoProvider } from 'contexts/AdventureOtto'
import { useDoItemBatchActions } from 'contracts/functions'
import { useMyOttos } from 'MyOttosProvider'
import UseItemCompleteView from 'views/my-items/use-item/UseItemCompleteView'
import { useDispatch } from 'react-redux'
import { hideOttoPopup } from 'store/uiSlice'

const StyledContainer = styled.div`
  display: grid;
  grid-template:
    'title title' 36px
    'info placeholder' auto / 1fr 1fr;
  gap: 20px;
  margin: 12px 24px 24px 24px;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    display: block;
  }
`

const StyledTitle = styled.div`
  color: ${({ theme }) => theme.colors.white};
  position: relative;
  display: flex;
  grid-area: title;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
  gap: 10px;
`

const StyledOttoInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  grid-area: info;
`

const StyledPlaceholder = styled.div`
  color: ${({ theme }) => theme.colors.white};
  display: flex;
  align-items: center;
  justify-content: center;
  grid-area: placeholder;
  text-align: center;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    display: none;
  }
`

const StyledUnequipAllButton = styled(Button).attrs({ padding: '0 12px', primaryColor: 'white' })`
  position: absolute;
  left: -20px;
  top: -8px;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    position: static;
    margin-left: -48px;
  }
`

const StyledSubmitButton = styled(Button)``

const StyledSubmitButtonHelp = styled(Note)`
  color: ${({ theme }) => theme.colors.white};
  text-align: center;
`

export default function OttoPopupBody() {
  const dispatch = useDispatch()
  const container = useRef<HTMLDivElement>(null)
  const { t } = useTranslation('', { keyPrefix: 'ottoPopup' })
  const [preview, setPreview] = useState<{ otto: Otto }>()
  const { updateOtto } = useMyOttos()
  const [saved, setSaved] = useState(false)
  const [oldOtto, setOldOtto] = useState<Otto | undefined>()
  const { otto, itemActions, unequipAllItems, setOtto } = useOtto()
  const { ottos: ottosRepo } = useRepositories()
  const [loadingPreviewData, setLoadingPreviewData] = useState(false)
  const { doItemBatchActions, doItemBatchActionsState, resetDoItemBatchActions } = useDoItemBatchActions()
  const [{ itemPopupWidth, itemPopupHeight, itemPopupOffset }, setItemPopupSize] = useState<{
    itemPopupWidth: number
    itemPopupHeight?: number
    itemPopupOffset: number
  }>({
    itemPopupWidth: 375,
    itemPopupOffset: 0,
  })
  const loading = loadingPreviewData || !otto
  const txPending = doItemBatchActionsState.state === 'Processing'

  useResizeObserver(container, () => {
    const rect = container?.current?.getBoundingClientRect()
    const itemPopupWidth = (rect?.width ?? 750) / 2
    const itemPopupHeight = rect ? rect.height - 40 : undefined
    const itemPopupOffset = Math.max(((rect?.width ?? 0) - itemPopupWidth) / 2, 0) - 20
    setItemPopupSize({ itemPopupWidth, itemPopupHeight, itemPopupOffset })
  })

  useEffect(() => {
    if (doItemBatchActionsState.state === 'Success' && otto) {
      otto.raw.resting_until = doItemBatchActionsState.restingUntil?.toISOString()
      setOtto(preview!.otto.clone())
      updateOtto(preview!.otto)
      setSaved(true)
    } else if (doItemBatchActionsState.state === 'Fail') {
      alert(doItemBatchActionsState.status.errorMessage)
      resetDoItemBatchActions()
    }
  }, [doItemBatchActionsState])

  useEffect(() => {
    if (!otto) {
      return
    }

    setLoadingPreviewData(true)
    const controller = new AbortController()
    const timer = setTimeout(() => {
      ottosRepo
        .withAbortSignal(controller.signal)
        .previewAdventureOtto(otto.id, undefined, itemActions)
        .then(setPreview)
        .finally(() => setLoadingPreviewData(false))
    }, 500)

    return () => {
      clearTimeout(timer)
      controller.abort()
    }
  }, [ottosRepo, otto?.id, itemActions])

  if (saved && oldOtto) {
    return (
      <UseItemCompleteView
        otto={oldOtto}
        updatedOtto={preview?.otto}
        hideCloseButton
        onClose={() => dispatch(hideOttoPopup())}
      />
    )
  }

  return (
    <AdventureOttoProvider otto={otto} draftOtto={preview?.otto}>
      <StyledContainer ref={container}>
        <StyledTitle>
          <StyledUnequipAllButton Typography={ContentMedium} onClick={unequipAllItems}>
            {t('unequipAllButton')}
          </StyledUnequipAllButton>
          <Headline>{t('title')}</Headline>
        </StyledTitle>

        <StyledOttoInfo>
          <OttoPreviewer
            hideFeedButton
            loading={loading}
            itemsPopupWidth={itemPopupWidth}
            itemPopupHeight={itemPopupHeight}
            itemPopupOffset={itemPopupOffset}
          />

          <OttoAdventureLevel otto={preview?.otto} loading={loading} />

          <OttoAttrs loading={loading} />

          <OttoStats showScore loading={loading} />

          <StyledSubmitButton
            disabled={!otto || itemActions.length === 0 || loading}
            loading={txPending}
            Typography={Headline}
            onClick={() => {
              setOldOtto(otto)
              doItemBatchActions(otto!.id, itemActions)
            }}
          >
            {t('submitButton')}
          </StyledSubmitButton>

          <StyledSubmitButtonHelp as="p">{t('submitButtonHelp')}</StyledSubmitButtonHelp>
        </StyledOttoInfo>

        <StyledPlaceholder>
          <ContentSmall dangerouslySetInnerHTML={{ __html: t('placeholder') }} />
        </StyledPlaceholder>
      </StyledContainer>
    </AdventureOttoProvider>
  )
}
