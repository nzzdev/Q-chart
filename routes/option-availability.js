const Boom = require("@hapi/boom");
const Joi = require("joi");

const {
  isDateSeries,
  getFirstColumnSerie,
} = require("../helpers/dateSeries.js");

const {
  isBarChart,
  isStackedBarChart,
  isLineChart,
  isAreaChart,
  isDotplot,
  isArrowChart,
  getChartTypeForItemAndWidth,
} = require("../helpers/chartType.js");

const configuredDivergingColorSchemes =
  require("../helpers/colorSchemes.js").getConfiguredDivergingColorSchemes();

const eventsAvailableForItem = require("../helpers/events.js").availableForItem;

module.exports = {
  method: "POST",
  path: "/option-availability/{optionName}",
  options: {
    validate: {
      payload: Joi.object(),
    },
  },
  handler: function (request, h) {
    const item = request.payload.item;

    if (request.params.optionName === "events") {
      return {
        available: eventsAvailableForItem(item),
      };
    }

    if (request.params.optionName === "bar") {
      return {
        available: isBarChart(item) || isStackedBarChart(item),
      };
    }

    if (request.params.optionName === "forceBarsOnSmall") {
      return {
        available:
          (isBarChart(item) || isStackedBarChart(item)) &&
          !item.options.barOptions.isBarChart,
      };
    }

    if (request.params.optionName === "line") {
      return {
        available: isLineChart(item),
      };
    }

    if (request.params.optionName === "area") {
      return {
        available: isAreaChart(item),
      };
    }

    if (request.params.optionName === "line.isStockChart") {
      try {
        const serie = getFirstColumnSerie(item.data);
        return {
          available: isDateSeries(serie) && isLineChart(item),
        };
      } catch (e) {
        return {
          available: false,
        };
      }
    }

    if (request.params.optionName === "dotplot") {
      return {
        available: isDotplot(item),
      };
    }

    if (request.params.optionName === "arrow") {
      return {
        available: isArrowChart(item),
      };
    }

    if (request.params.optionName === "arrow.colorScheme") {
      return {
        available: isArrowChart(item) && configuredDivergingColorSchemes,
      };
    }

    if (request.params.optionName === "dateseries") {
      // check first if the chart type actually supports date series handling
      // first we need to know if there is a chartType and which one
      const chartType = getChartTypeForItemAndWidth(item, 400); // just hardcode a small width here

      const chartTypeConfig = require(`../chartTypes/${chartType}/config.js`);
      if (!chartTypeConfig.data.handleDateSeries) {
        return {
          available: false,
        };
      }

      let isAvailable;

      try {
        const serie = getFirstColumnSerie(item.data);
        isAvailable = isDateSeries(serie);
      } catch (e) {
        isAvailable = false;
      }

      return {
        available: isAvailable,
      };
    }

    if (request.params.optionName === "dateSeriesOptions.labels") {
      const chartType = getChartTypeForItemAndWidth(item, 400); // just hardcode a small width here because it doesn't matter in this case
      return {
        available: chartType === "line" || chartType === "area",
      };
    }

    if (request.params.optionName === "highlightDataSeries") {
      return {
        available: !isArrowChart(item) && item.data[0].length > 2,
      };
    }

    // you can only overwrite series if no row colors are overwritten
    if (request.params.optionName === "colorOverwritesSeries") {
      return {
        available:
          (!Array.isArray(item.options.colorOverwritesRows) ||
            item.options.colorOverwritesRows.length === 0) &&
          !isArrowChart(item),
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
          !isArrowChart(item) &&
          !isLineChart(item) &&
          !isAreaChart(item),
      };
    }

    // highlighting rows does not make sense for Line Charts (this should use a value annotation feature)
    // for arrow charts it is not implemented yet, but would make sense to do that in a future version
    if (request.params.optionName === "highlightDataRows") {
      return {
        available:
          !isArrowChart(item) && !isLineChart(item) && !isAreaChart(item),
      };
    }

    if (request.params.optionName === "annotations") {
      let available = false;
      if (
        (isLineChart(item) || isBarChart(item) || isStackedBarChart(item)) &&
        item.data[0].length === 2 // only if there is just one data series
      ) {
        available = true;
      }

      if (isBarChart(item)) {
        available = true;
      }

      if (isStackedBarChart(item)) {
        available = true;
      }

      if (isDotplot(item)) {
        available = true;
      }

      if (isArrowChart(item)) {
        available = true;
      }

      return {
        available: available,
      };
    }

    if (request.params.optionName === "annotations.first") {
      return {
        available: isLineChart(item) || isArrowChart(item),
      };
    }

    if (request.params.optionName === "annotations.last") {
      return {
        available: isLineChart(item) || isArrowChart(item),
      };
    }

    if (request.params.optionName === "annotations.max") {
      return {
        available: isLineChart(item) || isDotplot(item),
      };
    }

    if (request.params.optionName === "annotations.min") {
      return {
        available: isLineChart(item) || isDotplot(item),
      };
    }

    if (request.params.optionName === "annotations.diff") {
      return {
        available: isDotplot(item) || isArrowChart(item),
      };
    }

    if (request.params.optionName === "annotations.valuesOnBars") {
      try {
        return {
          available: isBarChart(item) || isStackedBarChart(item),
        };
      } catch (e) {
        return {
          available: false,
        };
      }
    }

    if (request.params.optionName === "displayWeight") {
      return {
        available:
          isLineChart(item) ||
          ((isBarChart(item) || isStackedBarChart(item)) &&
            !item.options.barOptions.isBarChart),
      };
    }

    if (request.params.optionName === "hideLegend") {
      return {
        available:
          !isArrowChart(item) &&
          item.data[0].length > 2 &&
          Array.isArray(item.options.colorOverwritesRows) &&
          item.options.colorOverwritesRows.length > 0,
      };
    }

    return Boom.badRequest();
  },
};
