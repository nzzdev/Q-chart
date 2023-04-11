const commonPostprocessings = require("../commonPostprocessings.js");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

function reverseLineOrder(svg, spec, item, toolRuntimeConfig) {
  const svgDom = new JSDOM(svg);
  const document = svgDom.window.document;
  const dataSeriesGroup = document.querySelector(".data-series");

  const lineGroups = Array.from(dataSeriesGroup.children);

  // divide lineGroups array into highlighted and other line groups
  let highlightedLineGroups = [];
  let otherLineGroups = [];

  if (
    item.options.highlightDataSeries &&
    item.options.highlightDataSeries.length > 0
  ) {
    lineGroups.forEach((lineGroup, index) => {
      if (item.options.highlightDataSeries.includes(index)) {
        highlightedLineGroups.push(lineGroup);
      } else {
        otherLineGroups.push(lineGroup);
      }
    });
  }

  // this reverses the order of the line groups
  // putting the first on last and thus to the front
  const otherLineGroupReversed = otherLineGroups.reverse();
  const highlightedLineGroupsReversed = highlightedLineGroups.reverse();

  for (const dataSerieElement of otherLineGroupReversed) {
    dataSeriesGroup.appendChild(dataSerieElement);
  }

  // add highlighted line groups to the end and thus to the front
  for (const dataSerieElement of highlightedLineGroupsReversed) {
    dataSeriesGroup.appendChild(dataSerieElement);
  }
  return document.body.innerHTML;
}

module.exports = [
  commonPostprocessings.setTabularNumsTickLabels,
  commonPostprocessings.hideRepeatingTickLabels,
  commonPostprocessings.hideTicksWithoutLabels,
  commonPostprocessings.highlightZeroGridLineIfPositiveAndNegative,
  commonPostprocessings.addOutlineToAnnotationLabels,
  {
    process: reverseLineOrder,
  },
];
