let configuredDivergingColorSchemes;
if (process.env.DIVERGING_COLOR_SCHEMES) {
  try {
    configuredDivergingColorSchemes = JSON.parse(
      process.env.DIVERGING_COLOR_SCHEMES
    );
  } catch (e) {
    console.error(e);
  }
}

function getConfiguredDivergingColorSchemes() {
  return configuredDivergingColorSchemes;
}

function hasHighlight(item) {
  return (
    item.options !== undefined &&
    item.options.highlightDataSeries !== undefined &&
    item.options.highlightDataSeries !== null &&
    !Number.isNaN(item.options.highlightDataSeries)
  );
}

// this computes the color scheme based on the color schemes default and default_light given in toolRuntimeConfig
// and takes the option "highlightDataSeries" into account
function getComputeCategoricalColorScheme(item, toolRuntimeConfig) {
  // the default is to use the color scheme given in toolRuntimeConfig
  let scheme = toolRuntimeConfig.colorSchemes.categorical.default;

  // handle highlightDataSeries option
  if (hasHighlight(item)) {
    // set the complete scheme to the light variant
    scheme = toolRuntimeConfig.colorSchemes.categorical.default_light;
    // set the highlighted one to the default color
    scheme[item.options.highlightDataSeries] =
      toolRuntimeConfig.colorSchemes.categorical.default[
        item.options.highlightDataSeries
      ];
  }

  // handle custom color overwrites
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
      scheme[colorOverwrite.position - 1] = color;
    }
  }

  return scheme;
}

module.exports = {
  getConfiguredDivergingColorSchemes: getConfiguredDivergingColorSchemes,
  getComputeCategoricalColorScheme: getComputeCategoricalColorScheme
};
