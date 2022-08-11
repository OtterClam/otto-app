import { ComponentProps, PropsWithChildren } from 'react'
import styled from 'styled-components/macro'
import notificationImage from './notification.png'

const StyledContainer = styled.div<{ show: boolean }>`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;

  &::before {
    content: '';
    display: ${({ show }) => (show ? 'block' : 'none')};
    position: absolute;
    right: -${notificationImage.width / 2}px;
    top: -${notificationImage.height / 2}px;
    width: ${notificationImage.width / 2}px;
    height: ${notificationImage.height / 2}px;
    background: center / cover url(${notificationImage.src});
  }
`

export interface NotificationBadgeProps {
  show?: boolean
  className?: string
  as?: ComponentProps<typeof StyledContainer>['as']
}

export const notificationBadgeSize = {
  width: notificationImage.width / 2,
  height: notificationImage.height / 2,
}

export default function NotificationBadge({
  className,
  show,
  as,
  children,
}: PropsWithChildren<NotificationBadgeProps>) {
  return (
    <StyledContainer className={className} show={show} as={as}>
      {children}
    </StyledContainer>
  )
}
