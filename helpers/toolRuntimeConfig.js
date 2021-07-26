const getConfiguredDivergingColorSchemes =
  require("./colorSchemes.js").getConfiguredDivergingColorSchemes;

function getToolRuntimeConfigOptimizedForClientRequest(
  origToolRuntimeConfig,
  item
) {
  let toolRuntimeConfig = JSON.parse(JSON.stringify(origToolRuntimeConfig));
  // remove the grays as they are only needed for the legend
  delete toolRuntimeConfig.colorSchemes.grays;
  if (
    (!Array.isArray(item.options.highlightDataSeries) ||
      item.options.highlightDataSeries.length === 0) &&
    (!Array.isArray(item.options.highlightDataRows) ||
      item.options.highlightDataRows.length === 0)
  ) {
    delete toolRuntimeConfig.colorSchemes.categorical_light;
  }

  // if this is not an arrow chart, delete the diverging color schemes
  if (!(item.options.chartType === "Arrow")) {
    for (const scheme of getConfiguredDivergingColorSchemes()) {
      delete toolRuntimeConfig.colorSchemes[scheme.scheme_name];
    }
  } else {
    for (const scheme of getConfiguredDivergingColorSchemes()) {
      if (scheme.key !== item.options.arrowOptions.colorScheme) {
        delete toolRuntimeConfig.colorSchemes[scheme.scheme_name];
      }
    }
  }
  return toolRuntimeConfig;
}

module.exports = {
  getToolRuntimeConfigOptimizedForClientRequest,
};
