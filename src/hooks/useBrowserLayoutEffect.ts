import noop from 'lodash/noop'
import { useLayoutEffect } from 'react'

const useBrowserLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : noop

export default useBrowserLayoutEffect
