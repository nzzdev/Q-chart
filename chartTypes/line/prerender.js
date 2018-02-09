const d3config = require("../../config/d3.js");
const getFlatData = require("../../helpers/data.js").getFlatData;

const d3 = {
  format: require("d3-format"),
  scale: require("d3-scale")
};

module.exports = function(item, toolRuntimeConfig, spec, vega) {
  // if we have one value >= 10000 in the Y Axis, we will group thousands
  try {
    const minValue = spec.scales[1].minValue || 0;
    const maxValue =
      spec.scales[1].maxValue ||
      getFlatData(item.data)
        .sort((a, b) => a - b)
        .pop();

    const scale = d3.scale
      .scaleLinear()
      .domain([minValue, maxValue])
      .nice(spec.scales[1].nice); // the nice value of Y Scale

    // at NZZ we only group if we have 5 digits numbers
    const needsGrouping = scale.ticks().some(tickValue => {
      return tickValue >= 10000;
    });

    if (needsGrouping) {
      vega.formatLocale(d3config.formatLocale);
    } else {
      vega.formatLocale(d3config.formatLocaleNoGrouping);
    }
  } catch (err) {
    // fallback to grouping anyway if we have an error somehow as grouping even with 4 digits numbers is better than not grouping at all
    vega.formatLocale(d3config.formatLocale);
  }
};
