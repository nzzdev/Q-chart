const Boom = require("@hapi/boom");
const Joi = require("joi");

const dateSeries = require("../helpers/dateSeries.js");

module.exports = {
  method: "POST",
  path: "/dynamic-schema/{optionName}",
  options: {
    validate: {
      payload: Joi.object(),
    },
  },
  handler: function (request, h) {
    const item = request.payload.item;

    if (request.params.optionName === "chartType") {
      const schema = {
        enum: ["Bar", "StackedBar", "Line", "Area", "Dotplot"],
        "Q:options": {
          enum_titles: [
            "Säulen",
            "Gestapelte Säulen",
            "Linien",
            "Flächen",
            "Dot Plot",
          ],
        },
      };
      if (item.data && item.data[0] && item.data[0].length === 3) {
        schema.enum.push("Arrow");
        schema["Q:options"].enum_titles.push("Pfeile");
      }

      return schema;
    }

    if (request.params.optionName === "highlightDataSeries") {
      try {
        return {
          // constructs an array like [0,1,2,3,...] with as many indexes as there are data columns
          enum: [...item.data[0].slice(1).keys()],
          "Q:options": {
            enum_titles: item.data[0].slice(1),
          },
        };
      } catch {
        return {
          enum: [],
          "Q:options": {
            enum_titles: [],
          },
        };
      }
    }

    if (request.params.optionName === "highlighDataSeriesMaxItems") {
      try {
        return {
          maxItems: item.data[0].length - 2, // the number of data series - 1
        };
      } catch {
        return {
          maxItems: undefined,
        };
      }
    }

    if (request.params.optionName === "highlightDataRowsMaxItems") {
      try {
        return {
          maxItems: item.data.length - 2, // the number of data rows - 1
        };
      } catch {
        return {
          maxItems: undefined,
        };
      }
    }

    if (request.params.optionName === "highlighDataRows") {
      try {
        return {
          title: `${item.data[0][0]} wählen`,
          // constructs an array like [0,1,2,3,...] with as many indexes as there are data rows
          enum: [...item.data.slice(1).keys()],
          "Q:options": {
            enum_titles: item.data.map((row) => row[0]).slice(1),
            buttonLabel: "Hervorhebung",
          },
        };
      } catch {
        return {
          enum: [],
          "Q:options": {
            enum_titles: [],
          },
        };
      }
    }

    if (request.params.optionName === "colorOverwritesSeries") {
      try {
        return {
          maxItems: item.data[0].length - 1, // the number of data series
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
            ),
          },
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
            ),
          },
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
                .filter((key) => dateFormat.validIntervals.includes(key))
                .map((interval) => dateSeries.intervals[interval].label)
            ),
          },
        };
      } catch {
        return {};
      }
    }

    if (request.params.optionName === "dateSeriesOptions.prognosisStart") {
      try {
        return {
          // constructs an array like [null,0,1,2,3,...] with the indexes from the first data column
          enum: [null].concat([
            ...dateSeries.getFirstColumnSerie(item.data).keys(),
          ]),
          "Q:options": {
            enum_titles: ["keine"].concat(
              dateSeries.getFirstColumnSerie(item.data)
            ),
          },
        };
      } catch {
        return {
          enum: [null],
          "Q:options": {
            enum_titles: ["keine"],
          },
        };
      }
    }

    return Boom.badRequest();
  },
};
