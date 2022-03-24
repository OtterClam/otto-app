import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import Layout from 'Layout'

const StyledHomePage = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  padding: 3rem;
  border: solid 1px orange;
`

const HomePage = () => {
  const { t } = useTranslation()
  return (
    <Layout title={t('home.title')}>
      <StyledHomePage>
        <div style={{ background: '#666', width: '580px', height: '1800px' }} />
      </StyledHomePage>
    </Layout>
  )
}

export default HomePage
