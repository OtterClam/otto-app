const { DefinePlugin, Compilation } = require('webpack')
const withPWA = require('next-pwa')
const pkg = require('./package.json')
const { i18n } = require('./next-i18next.config')
const { AssetsManifestPlugin } = require('./webpack/assets-manifest')
const withTM = require('next-transpile-modules')(['@usedapp/core'])
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const imageDomains = ['api.otterclam.finance', 'api-testnet.otterclam.finance', 'imgur.com']
if (process.env.NODE_ENV === 'development') {
  imageDomains.push('localhost')
}

const isWatch = process.argv.includes('--watch')

module.exports = withBundleAnalyzer(
  withPWA(
    withTM({
      productionBrowserSourceMaps: false,
      eslint: {
        ignoreDuringBuilds: true,
      },
      webpack: (config) => {
        config.module.rules.push({
          test: /\.mp3$/,
          loader: 'file-loader',
        })
        config.plugins.push(
          new DefinePlugin({
            VERSION: pkg.version,
          })
        )
        config.plugins.push(new AssetsManifestPlugin())
        return config
      },
      i18n,
      images: {
        domains: imageDomains,
        formats: ['image/avif', 'image/webp'],
      },
      rewrites: async () => {
        return [
          {
            source: '/health',
            destination: '/api/health',
          },
        ]
      },
      headers: async () => {
        return [
          {
            source: '/:all*(svg|je?pg|png|js|json|ttf|woff2|mp3)',
            headers: [
              {
                key: 'Cache-Control',
                value: 'public,max-age=86400',
              },
            ],
          },
        ]
      },
    }),
    {
      pwa: {
        dest: 'public',
        scope: '/',
        cacheStartUrl: false,
        swSrc: './src/worker/index.ts',
        swDest: isWatch ? undefined : 'public/sw.js',
        disable: process.env.NODE_ENV === 'development',
      },
    }
  )
)
