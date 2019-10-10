module.exports = [
  require("./rendering-info/web.js"),
  require("./rendering-info/web-svg.js"),
  require("./stylesheet.js"),
  require("./script.js"),
  require("./option-availability.js"),
  require("./dynamic-enum.js"),
  require("./dynamic-schema.js"),
  require("./health.js"),
  require("./fixtures/data.js"),
  // require("./notification/hideAxisLabel.js"),
  // require("./notification/unsupportedDateFormat"),
  // require("./notification/shouldBeBarChart.js"),
  // require("./notification/shouldBeLineChart.js"),
  // require("./notification/shouldBeBars.js"),
  require("./locales.js"),
  require("./data.js"),
  require("./migration.js")
].concat(require("./schema.js"));
