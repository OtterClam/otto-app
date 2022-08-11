import _ from 'lodash'
import { useLayoutEffect } from 'react'

const useBrowserLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : _.noop

export default useBrowserLayoutEffect
