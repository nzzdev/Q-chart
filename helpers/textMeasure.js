const { createCanvas } = require("canvas");
const canvas = createCanvas(200, 200);
const context = canvas.getContext("2d");

function getLabelTextWidth(text, toolRuntimeConfig) {
  // CanvasRenderingContext2D.font expects the font string to be same form as CSS font specifier - https://developer.mozilla.org/en-US/docs/Web/CSS/font
  context.font = `${toolRuntimeConfig.text.fontWeight} ${toolRuntimeConfig.text.fontSize}px ${toolRuntimeConfig.text.font}`;
  return context.measureText(text).width;
}

function getAxisLabelTextWidth(text, toolRuntimeConfig) {
  // CanvasRenderingContext2D.font expects the font string to be same form as CSS font specifier - https://developer.mozilla.org/en-US/docs/Web/CSS/font
  context.font = `${toolRuntimeConfig.axis.labelFontWeight} ${toolRuntimeConfig.axis.labelFontSize}px ${toolRuntimeConfig.axis.labelFont}`;
  return context.measureText(text).width;
}

module.exports = {
  getLabelTextWidth,
  getAxisLabelTextWidth,
};
