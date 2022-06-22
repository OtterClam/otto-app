import { useRouter } from 'next/router'
import { useMemo } from 'react'

export default () => {
  const { asPath } = useRouter()
  return useMemo(() => asPath.split('#')[1], [asPath])
}
