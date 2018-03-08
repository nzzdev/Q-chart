const d3config = require("../../config/d3.js");
const dataHelpers = require("../../helpers/data.js");

const d3 = {
  format: require("d3-format"),
  array: require("d3-array")
};

module.exports = function(item, toolRuntimeConfig, spec, vega) {
  // if we have one value >= 10000 in the Y Axis, we will group thousands
  try {
    const divisor = dataHelpers.getDivisor(item.data);

    const minValue =
      spec.scales[1].maxValue ||
      dataHelpers
        .getFlatData(item.data)
        .sort((a, b) => b - a)
        .pop();

    const maxValue =
      spec.scales[1].maxValue ||
      dataHelpers
        .getFlatData(item.data)
        .sort((a, b) => a - b)
        .pop();

    // at NZZ we only group if we have 5 digits numbers
    const needsGrouping = d3.array
      .ticks(minValue / divisor, maxValue / divisor, 10)
      .some(tickValue => {
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
