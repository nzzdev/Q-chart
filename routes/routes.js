module.exports = [
  require("./rendering-info/web.js"),
  require("./rendering-info/web-svg.js"),
  require("./stylesheet.js"),
  require("./script.js"),
  require("./option-availability.js"),
  require("./dynamic-enum.js"),
  require("./health.js"),
  require("./fixtures/data.js"),
  require("./validation/sources.js")
].concat(require("./schema.js"));
