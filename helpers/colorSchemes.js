let configuredDivergingColorSchemes;
if(process.env.DIVERGING_COLOR_SCHEMES) {
  try {
    configuredDivergingColorSchemes = JSON.parse(process.env.DIVERGING_COLOR_SCHEMES);
  } catch (e) {
    console.error(e);
  }
}

function getConfiguredDivergingColorSchemes() {
  return configuredDivergingColorSchemes;
}

module.exports = {
  getConfiguredDivergingColorSchemes: getConfiguredDivergingColorSchemes
}