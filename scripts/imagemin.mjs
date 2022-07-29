// https://gist.github.com/tomchentw/19c4275bc2c2e89e18a616355a3cca88

import fs from 'fs'
import imagemin from 'imagemin'
import gif from 'imagemin-gifsicle'
import jpg from 'imagemin-jpegtran'
import svg from 'imagemin-svgo'
import png from 'imagemin-optipng'

const plugins = [
  gif({ interlaced: true }),
  jpg({ progressive: true }),
  png({ optimizationLevel: 5 }),
  svg({ plugins: [{ name: 'removeViewBox', active: false }] }),
]

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
