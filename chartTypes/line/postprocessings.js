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
  {
    process: reverseLineOrder
  },
  {
    process: function(svg, spec, item, toolRuntimeConfig) {
      const svgDom = new JSDOM(svg);
      const document = svgDom.window.document;

      const annotationLabels = document.querySelectorAll(
        ".line-annotation-label"
      );
      for (const label of annotationLabels) {
        const textNode = label.querySelector("text");

        // once this is supported by more browsers or we do not have to support them anymore,
        // we can use paint-order here. for now we just clone the textNode and use stroke instead of fill on the clone
        // textNode.setAttribute("paint-order", "stroke");

        const cloneTextNode = textNode.cloneNode(true);
        cloneTextNode.setAttribute("fill", "currentColor");
        cloneTextNode.setAttribute("stroke", "currentColor");
        cloneTextNode.setAttribute("stroke-width", "3px");

        textNode.parentNode.appendChild(cloneTextNode);

        // move the textNode to the end
        textNode.parentNode.appendChild(textNode);
      }
      return document.body.innerHTML;
    }
  }
];
