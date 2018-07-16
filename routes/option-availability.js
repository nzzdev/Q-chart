const Boom = require("boom");
const Joi = require("joi");
const isDateSeries = require("../helpers/dateSeries.js").isDateSeries;
const getFirstColumnSerie = require("../helpers/dateSeries.js")
  .getFirstColumnSerie;
const getChartTypeForItemAndWidth = require("../helpers/chartType.js")
  .getChartTypeForItemAndWidth;

function isBarChart(item) {
  return (
    item.options.chartType === "Bar" || item.options.chartType === "StackedBar"
  );
}

function isLineChart(item) {
  return item.options.chartType === "Line";
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
    if (request.params.optionName === "bar") {
      return {
        available:
          isBarChart(request.payload) && hasNoCustomVegaSpec(request.payload)
      };
    }

    if (request.params.optionName === "forceBarsOnSmall") {
      return {
        available:
          isBarChart(request.payload) &&
          !request.payload.options.barOptions.isBarChart &&
          hasNoCustomVegaSpec(request.payload)
      };
    }

    if (request.params.optionName === "line") {
      return {
        available:
          isLineChart(request.payload) && hasNoCustomVegaSpec(request.payload)
      };
    }

    if (request.params.optionName === "line.isStockChart") {
      const serie = getFirstColumnSerie(request.payload.data);
      return {
        available:
          isDateSeries(serie) &&
          isLineChart(request.payload) &&
          hasNoCustomVegaSpec(request.payload)
      };
    }

    if (request.params.optionName === "dotplot") {
      return {
        available:
          isDotplot(request.payload) && hasNoCustomVegaSpec(request.payload)
      };
    }

    if (request.params.optionName === "arrow") {
      return {
        available:
          isArrowChart(request.payload) && hasNoCustomVegaSpec(request.payload)
      };
    }

    if (request.params.optionName === "dateseries") {
      // check first if the chart type actually supports date series handling
      // first we need to know if there is a chartType and which one
      const chartType = getChartTypeForItemAndWidth(request.payload, 400); // just hardcode a small width here

      const chartTypeConfig = require(`../chartTypes/${chartType}/config.js`);
      if (!chartTypeConfig.data.handleDateSeries) {
        return {
          available: false
        };
      }

      let isAvailable;

      try {
        const serie = getFirstColumnSerie(request.payload.data);
        isAvailable =
          isDateSeries(serie) && hasNoCustomVegaSpec(request.payload);
      } catch (e) {
        isAvailable = false;
      }

      return {
        available: isAvailable
      };
    }

    if (
      request.params.optionName === "highlightDataSeries" ||
      request.params.optionName === "hideAxisLabel" ||
      request.params.optionName === "chartType" ||
      request.params.optionName === "highlightDataSeries" ||
      request.params.optionName === "colorOverwrite"
    ) {
      return {
        available: hasNoCustomVegaSpec(request.payload) && !isArrowChart(request.payload)
      };
    }

    if (request.params.optionName === "annotations") {
      let available = false;
      if (
        isLineChart(request.payload) &&
        hasNoCustomVegaSpec(request.payload) &&
        request.payload.data[0].length === 2 // only if there is just one data series
      ) {
        available = true;
      }

      if (isDotplot(request.payload) && hasNoCustomVegaSpec(request.payload)) {
        available = true;
      }

      return {
        available: available
      };
    }

    if (request.params.optionName === "annotations.first") {
      return {
        available: isLineChart(request.payload) || isArrowChart(request.payload)
      };
    }

    if (request.params.optionName === "annotations.last") {
      return {
        available: isLineChart(request.payload) || isArrowChart(request.payload)
      };
    }

    if (request.params.optionName === "annotations.max") {
      return {
        available: isLineChart(request.payload) || isDotplot(request.payload)
      };
    }

    if (request.params.optionName === "annotations.min") {
      return {
        available: isLineChart(request.payload) || isDotplot(request.payload)
      };
    }

    if (request.params.optionName === "annotations.diff") {
      return {
        available: isDotplot(request.payload) || isArrowChart(request.payload)
      };
    }

    return Boom.badRequest();
  }
};
