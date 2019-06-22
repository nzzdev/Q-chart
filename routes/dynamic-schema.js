const Boom = require("@hapi/boom");
const Joi = require("@hapi/joi");

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
          title: `${item.data[0][0]} wählen`
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
          enum: [null].concat(item.data.map((row, index) => index + 1)),
          "Q:options": {
            enum_titles: [""].concat(
              item.data.map((row, index) => `${index + 1} - (${row[0]})`)
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
