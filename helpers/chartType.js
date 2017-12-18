function getChartTypeForItemAndWidth(item, width) {
  if (item.options.chartType === 'Line') {
    return 'line';
  }

  if (item.options.chartType === 'Bar') {
    if (item.options.barOptions.isBarChart === false) {
      if (item.options.barOptions.forceBarsOnSmall) {
        if (width < 500) {
          return 'bar';
        } else {
          return 'column';
        }
      }
      return 'column';
    } else {
      return 'bar';
    }
  }
}

module.exports = {
  getChartTypeForItemAndWidth: getChartTypeForItemAndWidth
}
