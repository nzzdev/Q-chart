const fixtureDataDirectory = '../../resources/fixtures/data';

// provide every fixture data file present in ../../resources/fixtures/data
// has to be in sync with files created in build task - see ../../tasks/build.js
const fixtureData = [
  require(`${fixtureDataDirectory}/basicLine.json`),
  require(`${fixtureDataDirectory}/linePrognosis.json`),
  require(`${fixtureDataDirectory}/lineHighlight.json`),
  require(`${fixtureDataDirectory}/basicColumn.json`),
  require(`${fixtureDataDirectory}/basicBar.json`),
  require(`${fixtureDataDirectory}/mobileBar.json`),
  require(`${fixtureDataDirectory}/stackedMobileBar.json`),
  require(`${fixtureDataDirectory}/transposedMobileBar.json`),
  require(`${fixtureDataDirectory}/mobileBarHighlight.json`)
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
