const fixtureDataDirectory = '../../resources/fixtures/data';

// provide every fixture data file present in ../../resources/fixtures/data
// has to be in sync with files created in build task - see ../../tasks/build.js
const fixtureData = [
  require(`${fixtureDataDirectory}/basicLine.js`),
  require(`${fixtureDataDirectory}/basicColumn.js`)
];

module.exports = {
  path: '/fixtures/data',
  method: 'GET',
  config: {
    tags: ['api'],
    cors: true
  },
  handler: (request, reply) => {
    reply(fixtureData);
  }
}
