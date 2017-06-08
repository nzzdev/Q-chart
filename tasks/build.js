const fs = require('fs');
const crypto = require('crypto');
const Builder = require('systemjs-builder');

const builder = new Builder('', 'jspm.config.js');

builder.config({
  map: {
    'systemjs-babel-build': 'jspm_packages/npm/systemjs-plugin-babel@0.0.20/systemjs-babel-node.js'
  }
});

let hashMap = {};

return builder
  .bundle('q-chart/chart.js', { normalize: true, runtime: false, minify: true, mangle: true })
  .then(bundle => {
    const hash = crypto.createHash('md5');
    hash.update(bundle.source);
    const hashString = hash.digest('hex');
    const fileName = 'q-chart.js';
    const hashedFileName = `q-chart.${hashString.substring(0, 8)}.js`;
    fs.writeFileSync(`scripts/${fileName}`, bundle.source);
    hashMap[fileName] = hashedFileName;
  })
  .then(() => {
    fs.writeFileSync('scripts/hashMap.json', JSON.stringify(hashMap));
  })
  .then(() => {
    /* eslint-disable */
    console.log('Build complete');
    /* eslint-enable */
    process.exit(0);
  })
  .catch((err) => {
    /* eslint-disable */
    console.log('Build error', err);
    /* eslint-enable */
    process.exit(1);
  });

