const Boom = require("@hapi/boom");
const Joi = require("@hapi/joi");

const dateSeries = require("../helpers/dateSeries.js");

module.exports = {
  method: "POST",
  path: "/dynamic-schema/{optionName}",
  options: {
    validate: {
      payload: Joi.object()
    },
    cors: true
  },
  handler: function(request, h) {
    const item = request.payload.item;

    if (request.params.optionName === "eventDate") {
      try {
        return {
          maxItems: item.data.length - 2 // the number of data rows - 1
        };
      } catch {
        return {
          maxItems: undefined
        };
      }
    }

    if (request.params.optionName === "highlighDataSeries") {
      try {
        return {
          maxItems: item.data[0].length - 2 // the number of data series - 1
        };
      } catch {
        return {
          maxItems: undefined
        };
      }
    }

    if (request.params.optionName === "highlightDataRows") {
      try {
        return {
          maxItems: item.data.length - 2 // the number of data rows - 1
        };
      } catch {
        return {
          maxItems: undefined
        };
      }
    }

    if (request.params.optionName === "highlighDataRowsItem") {
      try {
        return {
          title: `${item.data[0][0]} wählen`,
          "Q:options": {
            buttonLabel: "Hervorhebung"
          }
        };
      } catch {
        return {};
      }
    }

    if (request.params.optionName === "colorOverwritesSeries") {
      try {
        return {
          maxItems: item.data[0].length - 1 // the number of data series
        };
      } catch {
        return {};
      }
    }

    if (request.params.optionName === "colorOverwritesSeriesItem") {
      try {
        return {
          enum: [null].concat(
            item.data[0].slice(1).map((val, index) => index + 1)
          ),
          "Q:options": {
            enum_titles: [""].concat(
              item.data[0]
                .slice(1)
                .map((val, index) => `${index + 1} - (${val})`)
            )
          }
        };
      } catch {
        return {};
      }
    }

    if (request.params.optionName === "colorOverwritesRowsItem") {
      try {
        return {
          enum: [null].concat(
            item.data.slice(1).map((row, index) => index + 1)
          ),
          "Q:options": {
            enum_titles: [""].concat(
              item.data
                .slice(1)
                .map((row, index) => `${index + 1} - (${row[0]})`)
            )
          }
        };
      } catch {
        return {};
      }
    }

    if (request.params.optionName === "dateSeriesOptions.interval") {
      try {
        const dateFormat = dateSeries.getDateFormatForData(item.data);
        return {
          enum: ["auto"].concat(dateFormat.validIntervals),
          "Q:options": {
            enum_titles: ["automatisch"].concat(
              Object.keys(dateSeries.intervals)
                .filter(key => dateFormat.validIntervals.includes(key))
                .map(interval => dateSeries.intervals[interval].label)
            )
          }
        };
      } catch {
        return {};
      }
    }

    return Boom.badRequest();
  }
};
