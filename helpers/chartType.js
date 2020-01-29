function isBarChart(item) {
  return item.options.chartType === "Bar";
}

function isStackedBarChart(item) {
  return item.options.chartType === "StackedBar";
}

function isLineChart(item) {
  return item.options.chartType === "Line";
}

function isAreaChart(item) {
  return item.options.chartType === "Area";
}

function isDotplot(item) {
  return item.options.chartType === "Dotplot";
}

function isArrowChart(item) {
  return item.options.chartType === "Arrow";
}

function getChartTypeForItemAndWidth(item, width) {
  if (item.options.chartType === "Line") {
    return "line";
  }

  if (item.options.chartType === "Area") {
    return "area";
  }

  if (item.options.chartType === "Dotplot") {
    return "dotplot";
  }

  if (item.options.chartType === "Arrow") {
    return "arrow";
  }

  if (item.options.chartType === "Bar") {
    if (!item.options.barOptions) {
      // the default is columns if no special options are defined
      return "column";
    }
    if (item.options.barOptions.isBarChart === false) {
      if (item.options.barOptions.forceBarsOnSmall) {
        if (width < 500) {
          return "bar";
        } else {
          return "column";
        }
      }
      return "column";
    } else {
      return "bar";
    }
  }

  if (item.options.chartType === "StackedBar") {
    if (!item.options.barOptions) {
      // the default is columns if no special options are defined
      return "column-stacked";
    }
    if (item.options.barOptions.isBarChart === false) {
      if (item.options.barOptions.forceBarsOnSmall) {
        if (width < 500) {
          return "bar-stacked";
        } else {
          return "column-stacked";
        }
      }
      return "column-stacked";
    } else {
      return "bar-stacked";
    }
  }
}

module.exports = {
  isBarChart,
  isStackedBarChart,
  isLineChart,
  isAreaChart,
  isDotplot,
  isArrowChart,
  getChartTypeForItemAndWidth
};
