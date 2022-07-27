const pkg = require('./package.json')
const { DefinePlugin, Compilation } = require('webpack')
const { i18n } = require('./next-i18next.config')
const withPWA = require('next-pwa')
const { AssetsManifestPlugin } = require('./webpack/assets-manifest')
const withTM = require('next-transpile-modules')(['@usedapp/core'])


module.exports = withPWA(
  withTM({
    productionBrowserSourceMaps: false,
    webpack: config => {
      config.module.rules.push({
        test: /\.mp3$/,
        loader: 'file-loader',
      })
      config.plugins.push(
        new DefinePlugin({
          VERSION: pkg.version,
        })
      )
      config.plugins.push(
        new AssetsManifestPlugin()
      )
      return config
    },
    i18n,
    pwa: {
      dest: 'public',
      scope: '/',
      cacheStartUrl: false,
      swSrc: './src/worker/index.ts',
    },
  })
)
