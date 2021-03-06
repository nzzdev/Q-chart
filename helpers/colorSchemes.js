const vega = require("vega");
const optionsHelpers = require("./options.js");
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

// this computes the color schemes categorical_computed_normal and categorical_computed_light based on color overwrites
function getComputedCategoricalColorSchemes(item) {
  if (!vega.scheme("categorical_normal") || !vega.scheme("categorical_light")) {
    throw new Error(
      "the schemes categorical_normal and categorical_light need to be registered first"
    );
  }
  // clone the schemes to not overwrite the original
  const schemes = {
    categorical_computed_normal: JSON.parse(
      JSON.stringify(vega.scheme("categorical_normal"))
    ),
    categorical_computed_light: JSON.parse(
      JSON.stringify(vega.scheme("categorical_light"))
    )
  };

  // handle custom color overwrites for data series
  // we can only handle series color overwrites here, row highlights have to be handled by
  // adding a property to the data and then selectively applying this color in the fill config for the row
  // this is done in the mapping of the single chart type where it makes sense
  if (Array.isArray(item.options.colorOverwritesSeries)) {
    for (const colorOverwrite of item.options.colorOverwritesSeries) {
      // if we do not have a valid color or position, ignore this
      if (!colorOverwrite.color || Number.isNaN(colorOverwrite.position)) {
        continue;
      }

      schemes.categorical_computed_normal[colorOverwrite.position - 1] =
        colorOverwrite.color;

      if (colorOverwrite.colorLight) {
        schemes.categorical_computed_light[colorOverwrite.position - 1] =
          colorOverwrite.colorLight;
      }
    }
  }

  // compute a colorscheme containing normal/light colors depending on the highlightDataSeries options.
  // this scheme is used for the legend only
  schemes.categorical_computed_series_highlight = JSON.parse(
    JSON.stringify(schemes.categorical_computed_normal)
  );

  // handle highlightDataSeries option
  if (optionsHelpers.hasSeriesHighlight(item)) {
    schemes.categorical_computed_series_highlight = JSON.parse(
      JSON.stringify(schemes.categorical_computed_light)
    );

    for (const highlightSerieIndex of item.options.highlightDataSeries) {
      schemes.categorical_computed_series_highlight[highlightSerieIndex] =
        schemes.categorical_computed_normal[highlightSerieIndex];
    }
  }

  return schemes;
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

  const computedSchemes = getComputedCategoricalColorSchemes(item);
  Object.keys(computedSchemes).forEach(colorSchemeName => {
    vega.scheme(colorSchemeName, computedSchemes[colorSchemeName]);
  });
}

module.exports = {
  getConfiguredDivergingColorSchemes: getConfiguredDivergingColorSchemes,
  registerColorSchemes: registerColorSchemes
};
