function hasSeriesHighlight(item) {
  return (
    item.options !== undefined &&
    item.options.highlightDataSeries !== undefined &&
    Array.isArray(item.options.highlightDataSeries) &&
    item.options.highlightDataSeries.length > 0
  );
}

module.exports = {
  hasSeriesHighlight: hasSeriesHighlight
};
