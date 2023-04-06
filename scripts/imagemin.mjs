import fs from 'fs';
import imagemin from 'imagemin';
import imageminGifsicle from 'imagemin-gifsicle';
import imageminJpegtran from 'imagemin-jpegtran';
import imageminOptipng from 'imagemin-optipng';
import imageminSvgo from 'imagemin-svgo';

const plugins = [
  [imageminGifsicle, {
    interlaced: true,
    optimizationLevel: 3 // set maximum optimization level (1-3)
  }],
  [imageminJpegtran, {
    progressive: true,
  }],
  [imageminOptipng, {
    optimizationLevel: 5, // set maximum optimization level (0-7)
  }],
  [imageminSvgo, {
    plugins: [
      {name: 'preset-default'},
      {name: 'removeViewBox', active: false}
    ],
  }],
].map(([plugin, options]) => plugin(options));

const minifyFile = filename =>
  new Promise((resolve, reject) =>
    fs.access(filename, fs.constants.F_OK, (err) => err ? reject(err) : resolve())
  )
  .then(() => new Promise((resolve, reject) =>
    fs.readFile(filename, (err, data) => err ? reject(err) : resolve(data))
  ))
  .then(originalBuffer => imagemin
    .buffer(originalBuffer, { plugins })
    .then(minimizedBuffer => ({
      minimized: minimizedBuffer !== originalBuffer,
      originalSize: originalBuffer.length,
      minimizedBuffer,
    }))
  ).then(({ minimizedBuffer }) => new Promise((resolve, reject) =>
    fs.writeFile(filename, minimizedBuffer, err => err ? reject(err) : resolve())
  ))
  .catch(e => {
    if (e.code === 'ENOENT') {
      console.log(`File not found: ${filename}`);
      return Promise.resolve();
    } else {
      console.error(e);
      process.exit(1);
    }
  });

Promise.resolve(process.argv)
  .then(x => x.slice(2))
  .then(x => x.map(minifyFile))
  .then(x => Promise.all(x))
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
