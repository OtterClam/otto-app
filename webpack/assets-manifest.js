const { writeFileSync, readFileSync, mkdirSync } = require('fs')
const { ConcatSource } = require('webpack-sources')
const { Compilation } = require('webpack')
const NormalModule = require('webpack/lib/NormalModule')
const { dirname, resolve, relative } = require('path')

const swFile = '../public/sw.js'
const cachedFile = resolve(__dirname, '../.next/cache/assets-manifest.json')

const readCachedManifest = () => {
  try {
    const content = readFileSync(cachedFile, 'utf8')
    return JSON.parse(content)
  } catch (err) {
    return {}
  }
}

const updateManifestCache = assets => {
  mkdirSync(dirname(cachedFile), { recursive: true })
  writeFileSync(cachedFile, JSON.stringify(assets, null, 2))
}

const updateManifest = (compilation, moduleAssets) => {
  const cache = readCachedManifest()
  const filePathToModulePath = Object.keys(cache).reduce(
    (obj, key) =>
      Object.assign(obj, {
        [cache[key]]: key,
      }),
    {}
  )
  const newManifest = {}

  const stats = compilation.getStats().toJson({
    all: false,
    assets: true,
    cachedAssets: true,
    ids: true,
    publicPath: true,
  })

  stats.assets.forEach(asset => {
    if (filePathToModulePath[asset.name]) {
      newManifest[filePathToModulePath[asset.name]] = asset.name
    }
  })

  Object.assign(newManifest, moduleAssets)

  updateManifestCache(newManifest)

  return newManifest
}

const transformManifest = manifest =>
  Object.keys(manifest).reduce(
    (obj, key) =>
      Object.assign(obj, {
        [key]: manifest[key].replace(/^\/static\//, '/_next/static/'),
      }),
    {}
  )

exports.AssetsManifestPlugin = class AssetsManifestPlugin {
  apply(compiler) {
    const assets = {}

    compiler.hooks.thisCompilation.tap(
      {
        name: 'AssetsManifestPlugin',
        stage: Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE_TRANSFER - 11,
      },
      compilation => {
        compilation.hooks.processAssets.tap(
          {
            name: 'AssetsManifestPlugin',
            stage: Compilation.PROCESS_ASSETS_STAGE_ADDITIONS,
          },
          () => {
            const asset = compilation.getAsset(swFile)
            if (asset) {
              const manifest = transformManifest(updateManifest(compilation, assets))
              compilation.updateAsset(swFile, old => {
                return new ConcatSource(`self.__ASSETS_LOADER_MANIFEST = ${JSON.stringify(manifest)};`, '\n', old)
              })
            }
          }
        )
      }
    )

    compiler.hooks.compilation.tap(
      {
        name: 'AssetsManifestPlugin',
        stage: Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE,
      },
      compilation => {
        NormalModule.getCompilationHooks(compilation).loader.tap(
          {
            name: 'AssetsManifestPlugin',
            stage: Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE,
          },
          (loaderContext, module) => {
            const { emitFile } = loaderContext

            loaderContext.emitFile = (file, content, sourceMap) => {
              if (module.userRequest && !assets[file]) {
                const userRequest = relative(resolve(__dirname, '..'), module.userRequest)
                Object.assign(assets, { [userRequest]: file })
              }

              return emitFile.call(module, file, content, sourceMap)
            }
          }
        )
      }
    )
  }
}
