import { useEthers } from '@usedapp/core'
import ConnectView from 'components/ConnectView'
import { PropsWithChildren } from 'react'

export default function RequireConnect({ children }: PropsWithChildren<object>) {
  const { account } = useEthers()
  // eslint-disable-next-line react/jsx-no-useless-fragment
  return <>{account ? children : <ConnectView />}</>
}
