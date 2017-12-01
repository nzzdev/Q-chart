function getChartTypeForItemAndWidth(item, width) {
  if (item.options.chartType === 'Line') {
    return 'line';
  }

  if (item.options.chartType === 'Bar') {
    if (item.options.barOptions.isBarChart === false) {
      return 'column';
    } else {
      if (item.options.barOptions.forceBarsOnSmall) {
        if (width < 500) {
          return 'bar';
        } else {
          return 'column';
        }
      }
    }
  }
}

module.exports = {
  getChartTypeForItemAndWidth: getChartTypeForItemAndWidth
}
