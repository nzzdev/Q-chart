const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const hideRepeatingTickLabels = {
  process: function(svg, spec, item, toolRuntimeConfig) {
    const svgDom = new JSDOM(svg);
    const document = svgDom.window.document;

    const labelGroups = document.querySelectorAll(".role-axis-label");
    for (const labelGroup of labelGroups) {
      const visibleTextNodes = Array.prototype.slice
        .call(labelGroup.querySelectorAll("text"))
        .filter(textNode => {
          return textNode.getAttribute("style").includes("opacity: 1");
        });
      // loop over all the visible textNodes, if the text is the same as the one before, hide it
      // start with the 2nd textNode
      for (let i = 1; i < visibleTextNodes.length; i++) {
        if (
          visibleTextNodes[i].innerHTML === visibleTextNodes[i - 1].innerHTML
        ) {
          visibleTextNodes[i].style.opacity = "0";
        }
      }
    }
    return document.body.innerHTML;
  }
};

const hideRepeatingBarTopLabels = {
  process: function(svg, spec, item, toolRuntimeConfig) {
    const svgDom = new JSDOM(svg);
    const document = svgDom.window.document;

    const barTopLabels = document.querySelectorAll(".bar-top-label");
    // loop over all the barTopLabels, if the text is the same as the one before, hide it
    // start with the 2nd barTopLabel
    for (let i = 1; i < barTopLabels.length; i++) {
      if (
        barTopLabels.item(i).innerHTML === barTopLabels.item(i - 1).innerHTML
      ) {
        barTopLabels.item(i).style.opacity = "0";
      }
    }
    return document.body.innerHTML;
  }
};

const highlightTicksWithVisibleValues = {
  process: function(svg, spec, item, toolRuntimeConfig) {
    const svgDom = new JSDOM(svg);
    const document = svgDom.window.document;

    const xAxisGroup = document.querySelector(".role-axis"); // the first is the x axis

    const labelGroup = xAxisGroup.querySelector(".role-axis-label");
    const tickGroup = xAxisGroup.querySelector(".role-axis-tick");

    const textNodes = labelGroup.querySelectorAll("text");
    const tickNodes = tickGroup.querySelectorAll("line");

    // first run to return if we have no hidden labels
    const visibleLabelsIndexes = [];
    let hasHiddenLabels = false;
    for (let i = 0; i < textNodes.length; i++) {
      const textNode = textNodes.item(i);
      // if the textNode is visible
      if (textNode.getAttribute("style").includes("opacity: 1")) {
        visibleLabelsIndexes.push(i);
      } else {
        hasHiddenLabels = true;
      }
    }

    // if there are no labels hidden, we do not highlight the ticks
    if (visibleLabelsIndexes.length === textNodes.length) {
      return svg;
    }

    for (let visibleLabelIndex of visibleLabelsIndexes) {
      tickNodes.item(visibleLabelIndex).setAttribute(
        "style",
        tickNodes
          .item(visibleLabelIndex)
          .getAttribute("style")
          .replace(
            `stroke: ${toolRuntimeConfig.axis.tickColor}`,
            `stroke: ${toolRuntimeConfig.axis.labelColor}`
          )
      );
    }
    return document.body.innerHTML;
  }
};

const addPrognosisPattern = {
  process: function(svg, spec, item, toolRuntimeConfig, id) {
    if (
      !item.options.dateSeriesOptions ||
      !Number.isInteger(item.options.dateSeriesOptions.prognosisStart)
    ) {
      return svg;
    }
    const svgDom = new JSDOM(svg);
    const document = svgDom.window.document;

    const patternElement = document.createElement("pattern");
    patternElement.setAttribute("id", `prognosisPattern${id}`);
    patternElement.setAttribute("patternUnits", "userSpaceOnUse");
    patternElement.setAttribute("width", "5");
    patternElement.setAttribute("height", "5");

    patternElement.innerHTML = `<path d="M0 5L5 0ZM6 4L4 6ZM-1 1L1 -1Z" style="stroke: white; stroke-width:1; stroke-opacity: 0.5;"/>`;

    document.querySelector("svg").appendChild(patternElement);

    return document.body.innerHTML;
  }
};

module.exports = {
  hideRepeatingTickLabels: hideRepeatingTickLabels,
  hideRepeatingBarTopLabels: hideRepeatingBarTopLabels,
  highlightTicksWithVisibleValues: highlightTicksWithVisibleValues,
  addPrognosisPattern: addPrognosisPattern
};
