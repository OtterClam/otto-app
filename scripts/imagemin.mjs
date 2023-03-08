// https://gist.github.com/tomchentw/19c4275bc2c2e89e18a616355a3cca88

'use strict';
const fs = require('fs');
const imagemin = require('imagemin');

const plugins = [
  ['imagemin-gifsicle', {
    interlaced: true,
    optimizationLevel: 3 // set maximum optimization level (1-3)
  }],
  ['imagemin-jpegtran', {
    progressive: true,
    quality: 80 // set maximum quality value (0-100)
  }],
  ['imagemin-optipng', {
    optimizationLevel: 5,
  }],
  ['imagemin-svgo', {
    plugins: [
      {removeViewBox: false},
    ],
  }],
].map(it => require(it[0])(it[1]))

const minifyFile = filename =>
  new Promise((resolve, reject) =>
    fs.readFile(filename, (err, data) => err ? reject(err) : resolve(data))
  )
  .then(originalBuffer => imagemin
    .buffer(originalBuffer, { plugins })
    .then(minimizedBuffer => ({
      // minimized: minimizedBuffer !== originalBuffer,
      // originalSize: originalBuffer.length,
      minimizedBuffer,
    }))
  ).then(({ minimizedBuffer }) => new Promise((resolve, reject) =>
    fs.writeFile(filename, minimizedBuffer, err => err ? reject(err) : resolve())
  ))

Promise.resolve(process.argv)
  .then(x => x.slice(2))
  .then(x => x.map(minifyFile))
  .then(x => Promise.all(x))
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
