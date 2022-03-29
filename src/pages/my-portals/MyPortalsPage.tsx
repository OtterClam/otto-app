import { gql, useQuery } from '@apollo/client'
import Layout from 'Layout'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import PortalCard from './PortalCard'

const StyledMyPortalsPage = styled.div`
  width: 100%;
  height: 100%;
  background-color: white;
  padding: 15px;
`

export const LIST_MY_PORTALS = gql`
  query ListMyPortals {
    ottos {
      tokenId
      owner
      tokenURI
    }
  }
`
export default function MyPortalsPage() {
  const { t } = useTranslation()
  const { data, loading } = useQuery(LIST_MY_PORTALS)
  console.log(JSON.stringify(data))
  return (
    <Layout title={t('my_portals.title')}>
      <StyledMyPortalsPage>
        <PortalCard />
      </StyledMyPortalsPage>
    </Layout>
  )
}
