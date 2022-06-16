const withTM = require('next-transpile-modules')(['@usedapp/core']);

module.exports = withTM({
  webpack: config => {
    config.module.rules.push({
      test: /\.mp3$/,
      loader: 'file-loader',
    })
    return config
  },
})
