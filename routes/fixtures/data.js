const fixtureDataDirectory = "../../resources/fixtures/data";

// provide every fixture data file present in ../../resources/fixtures/data
// has to be in sync with files created in build task - see ../../tasks/build.js
const fixtureData = [
  require(`${fixtureDataDirectory}/bar-color-overwrite-highlight.json`),
  require(`${fixtureDataDirectory}/bar-dates-days-prognosis.json`),
  require(`${fixtureDataDirectory}/bar-dates-null-values.json`),
  require(`${fixtureDataDirectory}/bar-dates-quarter.json`),
  require(`${fixtureDataDirectory}/bar-dates-years.json`),
  require(`${fixtureDataDirectory}/bar-qualitative-negative.json`),
  require(`${fixtureDataDirectory}/bar-qualitative-single-serie.json`),
  require(`${fixtureDataDirectory}/bar-stacked-days-prognosis.json`),
  require(`${fixtureDataDirectory}/bar-stacked-qualitative-negative.json`),
  require(`${fixtureDataDirectory}/line-annotation-min-max.json`),
  require(`${fixtureDataDirectory}/line-annotation-shortened-numbers.json`),
  require(`${fixtureDataDirectory}/line-dates-days.json`),
  require(`${fixtureDataDirectory}/line-dates-min-max-missing-value.json`),
  require(`${fixtureDataDirectory}/line-stock-chart.json`),
  require(`${fixtureDataDirectory}/vegaSpec.json`)
];

module.exports = {
  path: "/fixtures/data",
  method: "GET",
  options: {
    tags: ["api"],
    cors: true
  },
  handler: (request, h) => {
    return fixtureData;
  }
};
