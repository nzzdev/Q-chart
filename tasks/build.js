const fs = require('fs');
const crypto = require('crypto');

const Builder = require('systemjs-builder');
const builder = new Builder('', 'jspm.config.js');

const sass = require('node-sass');
const postcss = require('postcss');
const postcssImport = require('postcss-import');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');

const createFixtureData = require('./createFixtureData.js');

const stylesDir = __dirname + '/../styles_src/';

builder.config({
  map: {
    'systemjs-babel-build': 'jspm_packages/npm/systemjs-plugin-babel@0.0.20/systemjs-babel-node.js'
  }
});

function writeHashmap(hashmapPath, files, fileext) {
  const hashMap = {};
  files
    .map(file => {
      const hash = crypto.createHash('md5');
      hash.update(file.content, { encoding: 'utf8'} );
      file.hash = hash.digest('hex');
      return file;
    })
    .map(file => {
      hashMap[file.name] = `${file.name}.${file.hash.substring(0, 8)}.${fileext}`;
    });

  fs.writeFileSync(hashmapPath, JSON.stringify(hashMap));
}

async function buildScripts() {
  return builder
    .bundle('q-chart/chart.js', { normalize: true, runtime: false, minify: true, mangle: false })
    .then(bundle => {
      const fileName = 'q-chart';
      fs.writeFileSync(`scripts/${fileName}.js`, bundle.source);
      return [{
        name: fileName,
        content: bundle.source
      }];
    })
    .then((files) => {
      writeHashmap('scripts/hashMap.json', files, 'js');
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
}

async function compileStylesheet(name) {
  return new Promise((resolve, reject) => {
    const filePath = stylesDir + `${name}.scss`;
    fs.exists(filePath, (exists) => {
      if (!exists) {
        reject(`stylesheet not found ${filePath}`);
        process.exit(1);
      }
      sass.render(
        {
          file: filePath,
          includePaths: ['jspm_packages/github/', 'jspm_packages/npm/'],
          outputStyle: 'compressed'
        },
        (err, sassResult) => {
          if (err) {
            reject(err);
          } else {
            postcss()
              .use(postcssImport)
              .use(autoprefixer)
              .use(cssnano)
              .process(sassResult.css, {
                from: `${stylesDir}${name}.css`
              })
              .then(prefixedResult => {
                if (prefixedResult.warnings().length > 0) {
                  console.log(`failed to compile stylesheet ${name}`);
                  process.exit(1);
                }
                resolve(prefixedResult.css);
              });
          }
        }
      );
    });
  });
}

async function buildStyles() {
  // compile styles
  const styleFiles = [
    {
      name: 'default',
      content: await compileStylesheet('default')
    }
  ];

  styleFiles.map(file => {
    fs.writeFileSync(`styles/${file.name}.css`, file.content);
  });

  writeHashmap('styles/hashMap.json', styleFiles, 'css');
}

// create fixture data
// if new fixture data is added here, they have to be added in fixture data route as well
function buildFixtures() {
  fs.writeFileSync('resources/fixtures/data/basicLine.json', JSON.stringify(createFixtureData.basicLineChart()));
  fs.writeFileSync('resources/fixtures/data/linePrognosis.json', JSON.stringify(createFixtureData.lineChartPrognosis()));
  fs.writeFileSync('resources/fixtures/data/lineHighlight.json', JSON.stringify(createFixtureData.lineChartHighlight()));
  fs.writeFileSync('resources/fixtures/data/basicColumn.json', JSON.stringify(createFixtureData.basicColumnChart()));
  fs.writeFileSync('resources/fixtures/data/basicBar.json', JSON.stringify(createFixtureData.basicBarChart())); 
  fs.writeFileSync('resources/fixtures/data/mobileBar.json', JSON.stringify(createFixtureData.mobileBarChart()));
  fs.writeFileSync('resources/fixtures/data/stackedMobileBar.json', JSON.stringify(createFixtureData.stackedMobileBarChart()));
  fs.writeFileSync('resources/fixtures/data/transposedMobileBar.json', JSON.stringify(createFixtureData.transposedMobileBarChart()));
  fs.writeFileSync('resources/fixtures/data/mobileBarHighlight.json', JSON.stringify(createFixtureData.mobileBarChartHighlight()));
}

Promise.all(
  [
    buildFixtures(),
    buildScripts(),
    buildStyles()
  ])
  .then(res => {
    console.log('build complete');
  })
  .catch(err => {
    console.log(err);
    process.exit(1);
  });
