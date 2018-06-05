function hasHighlight(item) {
  return (
    item.options !== undefined &&
    item.options.highlightDataSeries !== undefined &&
    item.options.highlightDataSeries !== null &&
    !Number.isNaN(item.options.highlightDataSeries)
  );
}

// this computes the color range based on the color ranges given in toolRuntimeConfig
// and takes the option "highlightDataSeries" into account
function getComputedCategoryColorRange(item, toolRuntimeConfig) {
  let range = toolRuntimeConfig.colorSchemes.category.default;

  // handle highlightDataSeries option
  if (hasHighlight(item)) {
    range = toolRuntimeConfig.colorSchemes.category.light;
    range[item.options.highlightDataSeries] =
      toolRuntimeConfig.colorSchemes.category.default[
        item.options.highlightDataSeries
      ];
  }

  // handle custom colors
  if (Array.isArray(item.options.colorOverwrite)) {
    for (const colorOverwrite of item.options.colorOverwrite) {
      // if we do not have a valid color or position, ignore this
      if (!colorOverwrite.color || Number.isNaN(colorOverwrite.position)) {
        continue;
      }

      let color = colorOverwrite.color;
      // if we have highlightDataSeries and the current on is not the highlighted on, we use bright, otherwise default color
      if (
        hasHighlight(item) &&
        item.options.highlightDataSeries !== colorOverwrite.position - 1
      ) {
        color = colorOverwrite.colorBright;
      }
      // the position is a 1 based index, therefore we need to do -1
      range[colorOverwrite.position - 1] = color;
    }
  }

  return range;
}

function getComputedDivergingColorRange(item, toolRuntimeConfig) {
  // let range = toolRuntimeConfig.colorSchemes["diverging-3"].default;
  // // todo: handle color overwrite and in the future maybe highlighting
  // return range;
}

module.exports = {
  getComputedCategoryColorRange: getComputedCategoryColorRange,
  getComputedDivergingColorRange: getComputedDivergingColorRange
};
