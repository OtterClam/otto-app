import Layout from 'Layout'
import { useTranslation } from 'next-i18next'
import styled from 'styled-components'
import BG from './bg.jpg'
import Otter1 from './clam_pond_otter-1.png'
import StakeDialog from './stake/StakeDialog'

const StyledStakePage = styled.div`
  background: no-repeat center / cover url(${BG.src});
`

export default function StakePage() {
  const { t } = useTranslation('', { keyPrefix: 'stake' })
  return (
    <Layout title={t('title')}>
      <StyledStakePage>
        <StakeDialog />
      </StyledStakePage>
    </Layout>
  )
}
