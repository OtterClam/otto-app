import Button from 'components/Button'
import CloseButton from 'components/CloseButton'
import Fullscreen from 'components/Fullscreen'
import ItemCell from 'components/ItemCell'
import { useTransferItem } from 'contracts/functions'
import { ethers } from 'ethers'
import { Item } from 'models/Item'
import { useTranslation } from 'next-i18next'
import { useEffect, useState } from 'react'
import styled, { keyframes } from 'styled-components/macro'
import { ContentMedium, ContentSmall, Headline, Note, RegularInput } from 'styles/typography'
import TransferItemBg from './transfer-item-bg.png'

const StyledTransferItemPopup = styled.div`
  height: 90vh;
  padding: 35px 0;
  border: 2px solid ${({ theme }) => theme.colors.otterBlack};
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.white};
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
`

const StyledCloseButton = styled(CloseButton)`
  position: absolute;
  top: 20px;
  right: 20px;
`

const StyledTransferContainer = styled.section`
  width: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    width: 90%;
  }
`

const StyledInputContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
`

const StyledInput = styled(RegularInput)`
  width: 100%;
  border: 2px solid ${({ theme }) => theme.colors.otterBlack};
  border-radius: 10px;
  padding: 20px;

  ::placeholder {
    color: ${({ theme }) => theme.colors.lightGray400};
    opacity: 1;
  }
`

const StyledError = styled(Note)`
  color: ${({ theme }) => theme.colors.clamPink};
`

const StyledNote = styled(Note).attrs({ as: 'p' })`
  color: ${({ theme }) => theme.colors.darkGray300};
  text-align: center;
`

const StyledDesc = styled(ContentMedium).attrs({ as: 'p' })`
  text-align: center;
`

const Spirit = keyframes`
  from { background-position: 0px; }
  to { background-position: 600px; }
`

const StyledTransferItemBg = styled.div`
  width: 300px;
  height: 260px;
  background: url(${TransferItemBg.src}) 0 0;
  background-size: 600px 260px;
  position: relative;
  animation: ${Spirit} 1s steps(2) infinite;
`

const StyledTransferItemCell = styled(ItemCell)`
  position: absolute;
  top: 70px;
  left: calc(50% - 50px);
`

interface Props {
  item: Item
  onClose: () => void
}

export default function TransferItemPopup({ item, onClose }: Props) {
  const { t } = useTranslation('', { keyPrefix: 'my_items.transfer' })
  const { transferState, transfer, resetTransfer } = useTransferItem()
  const [amount, setAmount] = useState(1)
  const [address, setAddress] = useState('')
  const isValidAddress = ethers.utils.isAddress(address)
  const loading = transferState.status === 'PendingSignature' || transferState.status === 'Mining'

  const onTransfer = () => {
    transfer(item.metadata.tokenId, address, amount)
  }

  useEffect(() => {
    if (transferState.status === 'Fail' || transferState.status === 'Exception') {
      alert(transferState.errorMessage || '')
      resetTransfer()
    }
  }, [resetTransfer, transferState])

  return (
    <Fullscreen show>
      <StyledTransferItemPopup>
        <StyledCloseButton onClose={onClose} />
        {transferState.status !== 'Success' && (
          <StyledTransferContainer>
            <Headline>{t('title')}</Headline>
            <ItemCell item={item} size={240} />
            <StyledInputContainer>
              <ContentSmall>{t('amount')}</ContentSmall>
              <StyledInput
                disabled={loading}
                type="number"
                max={item.amount}
                min={1}
                value={amount}
                onChange={e => setAmount(Number(e.target.value))}
              />
            </StyledInputContainer>
            <StyledInputContainer>
              <ContentSmall>{t('address')}</ContentSmall>
              <StyledInput
                disabled={loading}
                type="text"
                value={address}
                placeholder="e.g. 0x1ed3..."
                onChange={e => setAddress(e.target.value)}
              />
              {address.length > 0 && !isValidAddress && <StyledError>{t('invalid_address')}</StyledError>}
              <StyledNote>{t('note')}</StyledNote>
            </StyledInputContainer>
            <Button Typography={Headline} width="100%" loading={loading} onClick={onTransfer}>
              {t('transfer_btn')}
            </Button>
          </StyledTransferContainer>
        )}
        {transferState.status === 'Success' && (
          <StyledTransferContainer>
            <Headline>{t('success_title')}</Headline>
            <StyledTransferItemBg>
              <StyledTransferItemCell item={item} size={100} />
            </StyledTransferItemBg>
            <StyledDesc>{t('success_desc')}</StyledDesc>
            <Button Typography={Headline} width="100%" primaryColor="white" onClick={onClose}>
              {t('close_btn')}
            </Button>
          </StyledTransferContainer>
        )}
      </StyledTransferItemPopup>
    </Fullscreen>
  )
}
