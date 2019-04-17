const vega = require("vega");
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
function getComputedCategoricalColorScheme(item) {
  // the default is to use the categorical_normal scheme
  let scheme = vega.scheme("categorical_normal");
  if (!scheme) {
    throw new Error(
      "the scheme categorical_normal needs to be registered first"
    );
  }

  // handle highlightDataSeries option
  if (hasHighlight(item)) {
    // set the complete scheme to the light variant
    scheme = vega.scheme("categorical_light");
    if (!scheme) {
      throw new Error(
        "the scheme categorical_light needs to be registered first"
      );
    }
    // set the highlighted one to the default color
    scheme[item.options.highlightDataSeries] = vega.scheme(
      "categorical_normal"
    )[item.options.highlightDataSeries];
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

// register any configured color schemes
function registerColorSchemes(item, toolRuntimeConfig) {
  if (!toolRuntimeConfig.colorSchemes) {
    return;
  }
  Object.keys(toolRuntimeConfig.colorSchemes).forEach(colorSchemeName => {
    vega.scheme(
      colorSchemeName,
      toolRuntimeConfig.colorSchemes[colorSchemeName]
    );
  });
  const computedScheme = getComputedCategoricalColorScheme(item);
  if (computedScheme) {
    vega.scheme(
      "categorical_computed",
      getComputedCategoricalColorScheme(item)
    );
  } else {
    throw new Error("failed to compute categorical_computed scheme");
  }
}

module.exports = {
  getConfiguredDivergingColorSchemes: getConfiguredDivergingColorSchemes,
  getComputedCategoricalColorScheme: getComputedCategoricalColorScheme,
  registerColorSchemes: registerColorSchemes
};
