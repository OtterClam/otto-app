import dynamic from 'next/dynamic'

export default dynamic(() => import('./Help'), { ssr: false })
