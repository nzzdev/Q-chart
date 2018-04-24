const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const highlightTicksWithVisibleValues = {
  process: function(svg, spec, item, toolRuntimeConfig) {
    // do this only if we have a times series
    if (spec.scales[0].type !== "time") {
      return svg;
    }

    const svgDom = new JSDOM(svg);
    const document = svgDom.window.document;

    const xAxisGroup = document.querySelector(".role-axis"); // the first is the x axis

    const labelGroup = xAxisGroup.querySelector(".role-axis-label");
    const tickGroup = xAxisGroup.querySelector(".role-axis-tick");

    const textNodes = labelGroup.querySelectorAll("text");
    const tickNodes = tickGroup.querySelectorAll("line");

    for (let i = 0; i < textNodes.length; i++) {
      const textNode = textNodes.item(i);
      // if the textNode is visible
      if (textNode.getAttribute("style").includes("opacity: 1")) {
        // change the color of the corresponding tick
        tickNodes.item(i).setAttribute(
          "style",
          tickNodes
            .item(i)
            .getAttribute("style")
            .replace(
              `stroke: ${toolRuntimeConfig.axis.tickColor}`,
              `stroke: ${toolRuntimeConfig.axis.labelColor}`
            )
        );
      }
    }
    return document.body.innerHTML;
  }
};

const addPrognosisPattern = {
  process: function(svg, spec, item, toolRuntimeConfig, id) {
    if (
      !item.options.dateSeriesOptions ||
      item.options.dateSeriesOptions.prognosisStart === undefined
    ) {
      return svg;
    }
    const svgDom = new JSDOM(svg);
    const document = svgDom.window.document;

    const patternElement = document.createElement("pattern");
    patternElement.setAttribute("id", `prognosisPattern${id}`);
    patternElement.setAttribute("patternUnits", "userSpaceOnUse");
    patternElement.setAttribute("width", "4");
    patternElement.setAttribute("height", "4");

    patternElement.innerHTML = `<path d="M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2" style="stroke: white; stroke-width:1; stroke-opacity: 0.5;"/>`;

    document.querySelector("svg").appendChild(patternElement);

    return document.body.innerHTML;
  }
};

module.exports = {
  highlightTicksWithVisibleValues: highlightTicksWithVisibleValues,
  addPrognosisPattern: addPrognosisPattern
};
