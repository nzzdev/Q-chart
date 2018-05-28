const commonPostprocessings = require("../commonPostprocessings.js");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

function reverseLineOrder(svg, spec, item, toolRuntimeConfig) {
  const svgDom = new JSDOM(svg);
  const document = svgDom.window.document;

  const dataSeriesGroup = document.querySelector(".data-series");

  // this reverses the order of the line groups
  // putting the first on last and thus to the front
  for (const dataSerieElement of dataSeriesGroup.children) {
    dataSeriesGroup.appendChild(dataSerieElement);
  }

  return document.body.innerHTML;
}

module.exports = [
  commonPostprocessings.hideRepeatingTickLabels,
  commonPostprocessings.highlightTicksWithVisibleValues,
  commonPostprocessings.highlightZeroGridLineIfPositiveAndNegative,
  commonPostprocessings.addOutlineToAnnotationLabels,
  {
    process: reverseLineOrder
  }
];
