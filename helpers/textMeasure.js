const { createCanvas } = require("canvas");
const canvas = createCanvas(200, 200);
const context = canvas.getContext("2d");

function getLabelTextWidth(text, toolRuntimeConfig) {
  context.font =
    toolRuntimeConfig.text.fontWeight +
    " " +
    toolRuntimeConfig.text.fontSize +
    " " +
    toolRuntimeConfig.text.font;
  return context.measureText(text).width;
}

function getAxisLabelTextWidth(text, toolRuntimeConfig) {
  context.font =
    toolRuntimeConfig.axis.labelFontWeight +
    " " +
    toolRuntimeConfig.axis.labelFontSize +
    " " +
    toolRuntimeConfig.axis.labelFont;
  return context.measureText(text).width;
}

module.exports = {
  getLabelTextWidth,
  getAxisLabelTextWidth
};
