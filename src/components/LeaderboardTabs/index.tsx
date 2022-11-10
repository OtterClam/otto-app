import { useBanners } from 'contexts/Banners'
import { BannerType } from 'models/Banner'
import { memo } from 'react'
import styled from 'styled-components/macro'
import Tab from './Tab'

const StyledContainer = styled.div`
  width: 100%;
  overflow-y: auto;
  padding-bottom: 20px;
  min-height: 145px;

  @media ${({ theme }) => theme.breakpoints.mobile} {
    padding-bottom: 0;
    min-height: 62px;
  }
`

const StyledTabs = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: no-wrap;
`

export default memo(function LeaderboardTabs({ className }: { className?: string }) {
  const banners = useBanners([BannerType.Leaderboard])
  return (
    <StyledContainer className={className}>
      <StyledTabs>
        {banners.map(banner => (
          <Tab key={banner.name} banner={banner} />
        ))}
      </StyledTabs>
    </StyledContainer>
  )
})
