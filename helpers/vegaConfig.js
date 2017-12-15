function hasHighlight(item) {
  return item.options.highlightDataSeries !== null && !Number.isNaN(item.options.highlightDataSeries);
}

// this computes the color range based on the color ranges given in toolRuntimeConfig
// and takes the option "highlightDataSeries" into account
function getComputedColorRange(item, toolRuntimeConfig) {
  let range = toolRuntimeConfig.colorSchemes.category.default;

  // handle highlightDataSeries option
  if (hasHighlight(item)) {
    range = toolRuntimeConfig.colorSchemes.category.light;
    range[item.options.highlightDataSeries] = toolRuntimeConfig.colorSchemes.category.default[item.options.highlightDataSeries];
  }

  // handle custom colors
  if (Array.isArray(item.options.colorOverwrite)) {
    for (const colorOverwrite of item.options.colorOverwrite) {
      // if we do not have a valid color or position, ignore this
      if (!colorOverwrite.color || Number.isNaN(colorOverwrite.position)) {
        continue;
      }

      let color = colorOverwrite.color;
      // if we have highlightDataSeries, we use bright, otherwise default color      
      if (hasHighlight(item)) {
        color = colorOverwrite.colorBright;
      }
      range[colorOverwrite.position] = color;
    }
  }

  return range;
}

module.exports = {
  getComputedColorRange: getComputedColorRange
};
