const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const dataHelpers = require("../helpers/data.js");
const { modifyColorStoke } = require("../helpers/elementModify.js");
const d3config = require("../config/d3.js");

const hideRepeatingTickLabels = {
  process: function (svg, spec, item, toolRuntimeConfig) {
    const svgDom = new JSDOM(svg);
    const document = svgDom.window.document;

    const labelGroups = document.querySelectorAll(".role-axis-label");
    for (const labelGroup of labelGroups) {
      const visibleTextNodes = Array.prototype.slice
        .call(labelGroup.querySelectorAll("text"))
        .filter((textNode) => {
          return textNode.getAttribute("opacity") === "1";
        });
      // loop over all the visible textNodes, if the text is the same as the one before, hide it
      // start with the 2nd textNode
      for (let i = 1; i < visibleTextNodes.length; i++) {
        if (
          visibleTextNodes[i].innerHTML === visibleTextNodes[i - 1].innerHTML
        ) {
          visibleTextNodes[i].setAttribute("opacity", "0");
        }
      }
    }
    return document.body.innerHTML;
  },
};

// Set Monoblock font for all tick labels if number labels only
const setTabularNumsTickLabels = {
  process: function (svg, spec, item, toolRuntimeConfig) {
    const svgDom = new JSDOM(svg);
    const document = svgDom.window.document;

    const labelGroups = document.querySelectorAll(".role-axis-label");

    // Only do this for charts with 2 axes, since you cannot know which axis is the y axis
    if (labelGroups.length === 2) {
      const xAxisGroup = labelGroups[0];
      const yAxisGroup = labelGroups[1];
      const visibleTextNodes = Array.prototype.slice
        .call(yAxisGroup.querySelectorAll("text"))
        .filter((textNode) => textNode.getAttribute("opacity") === "1");
      const selectAllLocalesAndDashes = new RegExp(
        `/s|${d3config.formatLocale.decimal}|${d3config.formatLocale.thousands}|${d3config.formatLocale.minus}|-/g`
      );
      const allTextNodesAreNumbers = visibleTextNodes.every(
        (textNode) =>
          !isNaN(textNode.innerHTML.replace(selectAllLocalesAndDashes, ""))
      );

      // Only apply monoblock if all labels are numbers
      if (allTextNodesAreNumbers) {
        visibleTextNodes.forEach((textNode) => {
          textNode.setAttribute("font-variant", "tabular-nums");
        });
      }
    }

    return document.body.innerHTML;
  },
};

const hideRepeatingBarTopLabels = {
  process: function (svg, spec, item, toolRuntimeConfig) {
    const svgDom = new JSDOM(svg);
    const document = svgDom.window.document;

    const barTopLabels = document.querySelectorAll(".bar-top-label");
    // loop over all the barTopLabels, if the text is the same as the one before, hide it
    // start with the 2nd barTopLabel
    for (let i = 1; i < barTopLabels.length; i++) {
      if (
        barTopLabels.item(i).innerHTML === barTopLabels.item(i - 1).innerHTML
      ) {
        barTopLabels.item(i).setAttribute("opacity", "0");
      }
    }
    return document.body.innerHTML;
  },
};

const hideTicksWithoutLabels = {
  process: function (svg, spec, item, toolRuntimeConfig) {
    const svgDom = new JSDOM(svg);
    const document = svgDom.window.document;

    const xAxisGroup = document.querySelector(".role-axis"); // the first is the x axis

    const labelGroup = xAxisGroup.querySelector(".role-axis-label");
    const tickGroup = xAxisGroup.querySelector(".role-axis-tick");

    const textNodes = labelGroup.querySelectorAll("text");
    const tickNodes = tickGroup.querySelectorAll("line");

    // first run to return if we have no hidden labels
    const hiddenLabelsIndexes = [];
    for (let i = 0; i < textNodes.length; i++) {
      const textNode = textNodes.item(i);
      // if the textNode is visible
      if (textNode.getAttribute("opacity") === "0") {
        hiddenLabelsIndexes.push(i);
      }
    }

    // if there are no hidden labels, we return here as there is nothing left to do
    if (hiddenLabelsIndexes.length === 0) {
      return svg;
    }

    for (let hiddenLabelIndex of hiddenLabelsIndexes) {
      tickNodes.item(hiddenLabelIndex).setAttribute("opacity", "0");
    }
    return document.body.innerHTML;
  },
};

const addPrognosisPattern = {
  process: function (svg, spec, item, toolRuntimeConfig, id) {
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
  },
};

const highlightZeroGridLineIfPositiveAndNegative = {
  process: function (svg, spec, item, toolRuntimeConfig, id) {
    // return early if there are only positive values
    if (
      dataHelpers.getMinValue(item.data) >= 0 &&
      dataHelpers.getMaxValue(item.data) >= 0
    ) {
      return svg;
    }
    // return early if there are only negative values
    if (
      dataHelpers.getMinValue(item.data) <= 0 &&
      dataHelpers.getMaxValue(item.data) <= 0
    ) {
      return svg;
    }

    const svgDom = new JSDOM(svg);
    const document = svgDom.window.document;

    // for columns and lines, the Y axis is the 2nd axis, for bars it's the first
    // we determine this by the domain value property for the y axes
    let axisIndex;
    if (
      spec.scales.find((scale) => scale.name === "yScale").domain.field ===
      "yValue"
    ) {
      axisIndex = 1;
    } else {
      axisIndex = 0;
    }
    const axisElements = document.querySelectorAll(".role-axis");
    const yAxisTickLabels = axisElements
      .item(axisIndex)
      .querySelectorAll("text");
    // find the index of the tick with the value 0
    let zeroTickIndex = undefined;
    for (let i = 0; i < yAxisTickLabels.length; i++) {
      const tick = yAxisTickLabels.item(i);
      const label = tick.innerHTML;
      const labelValue = parseFloat(
        label.replace(d3config.formatLocale.decimal, ".")
      );
      if (labelValue === 0) {
        zeroTickIndex = i;
      }
    }

    // if we have found the index of the zero tick
    // we are going to change the stroke color of the corresponding grid line and tick
    if (zeroTickIndex !== undefined) {
      modifyColorStoke(
        axisElements.item(axisIndex),
        zeroTickIndex,
        ".role-axis-grid",
        "line",
        toolRuntimeConfig.axis.labelColor
      );

      modifyColorStoke(
        axisElements.item(axisIndex),
        zeroTickIndex,
        ".role-axis-tick",
        "line",
        toolRuntimeConfig.axis.labelColor
      );
    }

    return document.body.innerHTML;
  },
};

const addOutlineToAnnotationLabels = {
  process: function (svg, spec, item, toolRuntimeConfig) {
    // this duplicates the text nodes to have a white outline around the text
    const svgDom = new JSDOM(svg);
    const document = svgDom.window.document;

    const annotationLabels = document.querySelectorAll(".annotation-label");
    for (const label of annotationLabels) {
      const textNode = label.querySelector("text");
      textNode.setAttribute("stroke", "currentColor");
      textNode.setAttribute("stroke-width", "3px");
      textNode.setAttribute("paint-order", "stroke");
      // move the textNode to the end
      textNode.parentNode.appendChild(textNode);
    }
    return document.body.innerHTML;
  },
};

const showOnlyFirstAndLastLabel = {
  process: function (svg, spec, item, toolRuntimeConfig) {
    const svgDom = new JSDOM(svg);
    const document = svgDom.window.document;
    const isDate =
      item.data[1] &&
      item.data[1][0] &&
      (item.data[1][0].getMonth !== undefined) | false;

    // this function only need to run if we are on mobile
    if (spec.width > 400 || !isDate) return document.body.innerHTML;

    const allLabelGroups = document.querySelectorAll(".role-axis-label");
    // only target x labels
    const xLabels = allLabelGroups.length > 0 ? allLabelGroups[0] : [];
    const visibleTextNodes = Array.prototype.slice
      .call(xLabels.querySelectorAll("text"))
      .filter((textNode) => {
        return textNode.getAttribute("opacity") === "1";
      });
    // 4 label should still be visible
    if (visibleTextNodes.length > 4) {
      // we set opacity to zero for all inbetween nodes, leaving the first and last visible
      for (let i = 1; i < visibleTextNodes.length - 1; i++) {
        visibleTextNodes[i].setAttribute("opacity", "0");
      }
    }

    return document.body.innerHTML;
  },
};

module.exports = {
  setTabularNumsTickLabels: setTabularNumsTickLabels,
  hideRepeatingTickLabels: hideRepeatingTickLabels,
  hideRepeatingBarTopLabels: hideRepeatingBarTopLabels,
  hideTicksWithoutLabels: hideTicksWithoutLabels,
  addPrognosisPattern: addPrognosisPattern,
  highlightZeroGridLineIfPositiveAndNegative:
    highlightZeroGridLineIfPositiveAndNegative,
  addOutlineToAnnotationLabels: addOutlineToAnnotationLabels,
  showOnlyFirstAndLastLabel: showOnlyFirstAndLastLabel,
};
