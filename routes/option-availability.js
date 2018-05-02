const Boom = require("boom");
const Joi = require("joi");
const isDateSeries = require("../helpers/dateSeries.js").isDateSeries;
const getFirstColumnSerie = require("../helpers/dateSeries.js")
  .getFirstColumnSerie;

function isBarChart(item) {
  return (
    item.options.chartType === "Bar" || item.options.chartType === "StackedBar"
  );
}

function isLineChart(item) {
  return item.options.chartType === "Line";
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

    if (request.params.optionName === "dateseries") {
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
        available: hasNoCustomVegaSpec(request.payload)
      };
    }

    if (request.params.optionName === "annotations") {
      return {
        available:
          isLineChart(request.payload) &&
          hasNoCustomVegaSpec(request.payload) &&
          request.payload.data[0].length === 2 // only if there is just one data series
      };
    }

    return Boom.badRequest();
  }
};
