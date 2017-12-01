function getExactPixelWidth(toolRuntimeConfig) {
  if (!toolRuntimeConfig.size || !Array.isArray(toolRuntimeConfig.size.width)) {
    return undefined;
  }
  for (let width of toolRuntimeConfig.size.width) {
    if (width && width.value && width.comparison === '=' && (!width.unit || width.unit === 'px')) {
      return width.value;
    }
  }
  return undefined;
}

module.exports = {
  getExactPixelWidth: getExactPixelWidth
}
