import { IS_SERVER } from 'constant'
import { useAssetsLoader } from 'contexts/AssetsLoader'
import { useEffect, useState } from 'react'
import { BundleName } from '../worker/consts'

export default function useAssetsBundles(names: BundleName[], deps: any[] = []) {
  const [loadingProgress, setLoadingProgress] = useState<number>(0)
  const assetsLoader = useAssetsLoader()

  useEffect(() => {
    if (IS_SERVER) {
      return
    }
    assetsLoader.loadBundleByNames(names)
    assetsLoader.on('progress', setLoadingProgress)
  }, [names, ...deps])

  return loadingProgress
}
