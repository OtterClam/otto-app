const { i18n } = require('./next-i18next.config')
const withTM = require('next-transpile-modules')(['@usedapp/core'])

module.exports = withTM({
  webpack: config => {
    config.module.rules.push({
      test: /\.mp3$/,
      loader: 'file-loader',
    })
    return config
  },
  i18n,
})
