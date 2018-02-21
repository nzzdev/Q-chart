module.exports = [
  require("./rendering-info/html-js.js"),
  require("./rendering-info/web.js"),
  require("./rendering-info/web-svg.js"),
  require("./stylesheet.js"),
  require("./script.js"),
  require("./option-availability.js"),
  require("./dynamic-enum.js"),
  require("./health.js"),
  require("./fixtures/data.js")
].concat(require("./schema.js"));
