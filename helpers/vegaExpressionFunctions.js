const vega = require("vega");
const textMeasure = require("./textMeasure.js");
const dateSeries = require("./dateSeries.js");

function registerExpressionFunctions(toolRuntimeConfig) {
  vega.expressionFunction("measureAxisLabelWidth", function(text) {
    return textMeasure.getAxisLabelTextWidth(text, toolRuntimeConfig);
  });

  vega.expressionFunction(
    "formatDateForInterval",
    dateSeries.formatDateForInterval
  );
}

module.exports = {
  registerExpressionFunctions
};
