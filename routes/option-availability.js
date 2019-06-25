const Boom = require("@hapi/boom");
const Joi = require("@hapi/joi");
const isDateSeries = require("../helpers/dateSeries.js").isDateSeries;
const getFirstColumnSerie = require("../helpers/dateSeries.js")
  .getFirstColumnSerie;
const getChartTypeForItemAndWidth = require("../helpers/chartType.js")
  .getChartTypeForItemAndWidth;

const configuredDivergingColorSchemes = require("../helpers/colorSchemes.js").getConfiguredDivergingColorSchemes();

function isBarChart(item) {
  return (
    item.options.chartType === "Bar" || item.options.chartType === "StackedBar"
  );
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

function hasNoCustomVegaSpec(item) {
  return item.vegaSpec === undefined || item.vegaSpec === "";
}

module.exports = {
  method: "POST",
  path: "/option-availability/{optionName}",
  options: {
    validate: {
      payload: Joi.object()
    },
    cors: true
  },
  handler: function(request, h) {
    const item = request.payload.item;
    if (request.params.optionName === "bar") {
      return {
        available: isBarChart(item) && hasNoCustomVegaSpec(item)
      };
    }

    if (request.params.optionName === "forceBarsOnSmall") {
      return {
        available:
          isBarChart(item) &&
          !item.options.barOptions.isBarChart &&
          hasNoCustomVegaSpec(item)
      };
    }

    if (request.params.optionName === "line") {
      return {
        available: isLineChart(item) && hasNoCustomVegaSpec(item)
      };
    }

    if (request.params.optionName === "area") {
      return {
        available: isAreaChart(item) && hasNoCustomVegaSpec(item)
      };
    }

    if (request.params.optionName === "line.isStockChart") {
      try {
        const serie = getFirstColumnSerie(item.data);
        return {
          available:
            isDateSeries(serie) &&
            isLineChart(item) &&
            hasNoCustomVegaSpec(item)
        };
      } catch (e) {
        return {
          available: false
        };
      }
    }

    if (request.params.optionName === "dotplot") {
      return {
        available: isDotplot(item) && hasNoCustomVegaSpec(item)
      };
    }

    if (request.params.optionName === "arrow") {
      return {
        available: isArrowChart(item) && hasNoCustomVegaSpec(item)
      };
    }

    if (request.params.optionName === "arrow.colorScheme") {
      return {
        available:
          isArrowChart(item) &&
          hasNoCustomVegaSpec(item) &&
          configuredDivergingColorSchemes
      };
    }

    if (request.params.optionName === "dateseries") {
      // check first if the chart type actually supports date series handling
      // first we need to know if there is a chartType and which one
      const chartType = getChartTypeForItemAndWidth(item, 400); // just hardcode a small width here

      const chartTypeConfig = require(`../chartTypes/${chartType}/config.js`);
      if (!chartTypeConfig.data.handleDateSeries) {
        return {
          available: false
        };
      }

      let isAvailable;

      try {
        const serie = getFirstColumnSerie(item.data);
        isAvailable = isDateSeries(serie) && hasNoCustomVegaSpec(item);
      } catch (e) {
        isAvailable = false;
      }

      return {
        available: isAvailable
      };
    }

    if (
      request.params.optionName === "chartType" ||
      request.params.optionName === "hideAxisLabel"
    ) {
      return {
        available: hasNoCustomVegaSpec(item)
      };
    }

    if (request.params.optionName === "highlightDataSeries") {
      return {
        available:
          hasNoCustomVegaSpec(item) &&
          !isArrowChart(item) &&
          item.data[0].length > 2
      };
    }

    // you can only overwrite series if no row colors are overwritten
    if (request.params.optionName === "colorOverwritesSeries") {
      return {
        available:
          (!Array.isArray(item.options.colorOverwritesRows) ||
            item.options.colorOverwritesRows.length === 0) &&
          hasNoCustomVegaSpec(item) &&
          !isArrowChart(item)
      };
    }

    // you can only overwrite rows if no series colors are overwritten and
    // color overwriting the rows is only possible if there are no more than 2 data series
    // this is done to be able to generate a reasonable legend with only two items using grayscale colors
    // having more than two dataseries would make the legend weird and probably would never be used anyway.
    // if we figure out that the case exists in the future, we can think about ways of solving this.
    if (request.params.optionName === "colorOverwritesRows") {
      return {
        available:
          (!Array.isArray(item.options.colorOverwritesSeries) ||
            item.options.colorOverwritesSeries.length === 0) &&
          item.data[0].length < 4 &&
          hasNoCustomVegaSpec(item) &&
          !isArrowChart(item) &&
          !isLineChart(item) &&
          !isAreaChart(item)
      };
    }

    // highlighting rows does not make sense for Line Charts (this should use an value annotation feature)
    // for arrow charts it is not implemented yet, but would make sense to do that in a future version
    if (request.params.optionName === "highlightDataRows") {
      return {
        available:
          hasNoCustomVegaSpec(item) &&
          !isArrowChart(item) &&
          !isLineChart(item) &&
          !isAreaChart(item)
      };
    }

    if (request.params.optionName === "annotations") {
      let available = false;
      if (
        isLineChart(item) &&
        hasNoCustomVegaSpec(item) &&
        item.data[0].length === 2 // only if there is just one data series
      ) {
        available = true;
      }

      if (isDotplot(item) && hasNoCustomVegaSpec(item)) {
        available = true;
      }

      if (isArrowChart(item) && hasNoCustomVegaSpec(item)) {
        available = true;
      }

      return {
        available: available
      };
    }

    if (request.params.optionName === "annotations.first") {
      return {
        available: isLineChart(item) || isArrowChart(item)
      };
    }

    if (request.params.optionName === "annotations.last") {
      return {
        available: isLineChart(item) || isArrowChart(item)
      };
    }

    if (request.params.optionName === "annotations.max") {
      return {
        available: isLineChart(item) || isDotplot(item)
      };
    }

    if (request.params.optionName === "annotations.min") {
      return {
        available: isLineChart(item) || isDotplot(item)
      };
    }

    if (request.params.optionName === "annotations.diff") {
      return {
        available: isDotplot(item) || isArrowChart(item)
      };
    }

    if (request.params.optionName === "displayWeight") {
      return {
        available:
          isLineChart(item) ||
          (isBarChart(item) && !item.options.barOptions.isBarChart)
      };
    }

    if (request.params.optionName === "hideLegend") {
      return {
        available:
          !isArrowChart(item) &&
          item.data[0].length > 2 &&
          Array.isArray(item.options.colorOverwritesRows) &&
          item.options.colorOverwritesRows.length > 0
      };
    }

    return Boom.badRequest();
  }
};
