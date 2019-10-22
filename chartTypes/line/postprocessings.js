const commonPostprocessings = require("../commonPostprocessings.js");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

function reverseLineOrder(svg, spec, item, toolRuntimeConfig) {
  const svgDom = new JSDOM(svg);
  const document = svgDom.window.document;
  const dataSeriesGroup = document.querySelector(".data-series");
  // this reverses the order of the line groups
  // putting the first on last and thus to the front
  const lineGroups = Array.from(dataSeriesGroup.children).reverse();

  // todo: we should put the highlighted lines here to the end of the array

  for (const dataSerieElement of lineGroups) {
    dataSeriesGroup.appendChild(dataSerieElement);
  }
  return document.body.innerHTML;
}

module.exports = [
  commonPostprocessings.hideRepeatingTickLabels,
  commonPostprocessings.hideTicksWithoutLabels,
  commonPostprocessings.highlightZeroGridLineIfPositiveAndNegative,
  commonPostprocessings.addOutlineToAnnotationLabels,
  {
    process: reverseLineOrder
  }
];
