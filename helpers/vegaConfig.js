// this computes the color range based on the color ranges given in toolRuntimeConfig
// and takes the option "highlightDataSeries" into account
function getComputedColorRange(item, toolRuntimeConfig) {
  try {
    if (!Number.isNaN(item.options.highlightDataSeries)) {
      let range = toolRuntimeConfig.colorSchemes.category.light;
      range[item.options.highlightDataSeries] = toolRuntimeConfig.colorSchemes.category.default[item.options.highlightDataSeries];
      return range;
    } else {
      // todo: use hapi/bounce here to differentiate between different errors
      return toolRuntimeConfig.colorSchemes.category.default;
    }
  } catch (err) {
    // if we got a problem accessing the option
    // we just return the default range
    return undefined;
  }
}

module.exports = {
  getComputedColorRange: getComputedColorRange
};
