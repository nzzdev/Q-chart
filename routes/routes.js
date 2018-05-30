module.exports = [
  require("./rendering-info/web.js"),
  require("./rendering-info/web-svg.js"),
  require("./stylesheet.js"),
  require("./script.js"),
  require("./option-availability.js"),
  require("./dynamic-enum.js"),
  require("./health.js"),
  require("./fixtures/data.js"),
  require("./validate/hideAxisLabel.js"),
  require("./validate/shouldBeBarChart.js"),
  require("./validate/shouldBeLineChart.js"),
  require("./validate/tooManyBars.js"),
  require("./locales.js")
].concat(require("./schema.js"));
