const fixtureDataDirectory = '../../resources/fixtures/data';

// provide every fixture data file present in ../../resources/fixtures/data
// has to be in sync with files created in build task - see ../../tasks/build.js
const fixtureData = [
  require(`${fixtureDataDirectory}/basicLine.js`),
  require(`${fixtureDataDirectory}/linePrognosis.js`),
  require(`${fixtureDataDirectory}/lineHighlight.js`),
  require(`${fixtureDataDirectory}/basicColumn.js`),
  require(`${fixtureDataDirectory}/basicBar.js`),
  require(`${fixtureDataDirectory}/mobileBar.js`),
  require(`${fixtureDataDirectory}/stackedMobileBar.js`),
  require(`${fixtureDataDirectory}/transposedMobileBar.js`),
  require(`${fixtureDataDirectory}/mobileBarHighlight.js`)
];

module.exports = {
  path: '/fixtures/data',
  method: 'GET',
  options: {
    tags: ['api'],
    cors: true
  },
  handler: (request, h) => {
    return fixtureData;
  }
}
