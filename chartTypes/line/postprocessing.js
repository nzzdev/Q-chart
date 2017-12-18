const jsdom = require('jsdom');
const { JSDOM } = jsdom;

module.exports = {
  process: function(svg, item, toolRuntimeConfig) {
    const svgDom = new JSDOM(svg);
    const document = svgDom.window.document;

    const xAxisGroup = document.querySelector('.role-axis'); // the first is the x axis

    const labelGroup = xAxisGroup.querySelector('.role-axis-label');
    const tickGroup = xAxisGroup.querySelector('.role-axis-tick');

    const textNodes = labelGroup.querySelectorAll('text');
    const tickNodes = tickGroup.querySelectorAll('line');

    for (let i = 0; i < textNodes.length; i++) {
      const textNode = textNodes.item(i);
      // debugger;
      // if the textNode is visible
      if (textNode.getAttribute('style').includes('opacity: 1')) {
        // change the color of the corresponding tick
        tickNodes.item(i).setAttribute('style', tickNodes.item(i).getAttribute('style')
          .replace(`stroke: ${toolRuntimeConfig.axis.tickColor}`, `stroke: ${toolRuntimeConfig.axis.labelColor}`));
      }
    }
    return document.body.innerHTML;
  }
}
