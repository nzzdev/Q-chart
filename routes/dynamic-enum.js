const Boom = require("@hapi/boom");
const Joi = require("@hapi/joi");
const getFirstColumnSerie = require("../helpers/dateSeries.js")
  .getFirstColumnSerie;

function getChartTypeEnumWithTitles(item) {
  const chartTypes = {
    enum: ["Bar", "StackedBar", "Line", "Dotplot"],
    enum_titles: ["Säulen", "Gestapelte Säulen", "Linien", "Dot Plot"]
  };
  try {
    if (item.data[0].length === 3) {
      chartTypes.enum.push("Arrow");
      chartTypes.enum_titles.push("Pfeile");
    }
  } catch (e) {
    // ignore the error, arrow will only be available if we have exactly 3 columns
  }
  return chartTypes;
}

function getHighlightSeriesEnum(item) {
  if (item.data.length < 1) {
    return [];
  }
  // constructs an array like [0,1,2,3,...] with as many indexes as there are data columns
  return [...item.data[0].slice(1).keys()];
}

function getHighlightSeriesEnumTitles(item) {
  if (item.data.length < 1) {
    return [];
  }
  return item.data[0].slice(1);
}

function getHighlightRowsEnum(item) {
  if (item.data.length < 1) {
    return [];
  }
  // constructs an array like [0,1,2,3,...] with as many indexes as there are data rows
  return [...item.data.slice(1).keys()];
}

function getHighlightRowsEnumTitles(item) {
  if (item.data.length < 1) {
    return [];
  }
  return item.data.map(row => row[0]).slice(1);
}

function getPrognosisStartEnum(item) {
  try {
    // constructs an array like [null,0,1,2,3,...] with the indexes from the first data column
    return [null].concat([...getFirstColumnSerie(item.data).keys()]);
  } catch (e) {
    return [null];
  }
}
function getPrognosisStartEnumTitles(item) {
  try {
    return ["keine"].concat(getFirstColumnSerie(item.data));
  } catch (e) {
    return ["keine"];
  }
}

module.exports = {
  method: "POST",
  path: "/dynamic-enum/{optionName}",
  options: {
    validate: {
      payload: Joi.object()
    },
    cors: true
  },
  handler: function(request, h) {
    const item = request.payload.item;
    if (request.params.optionName === "chartType") {
      return getChartTypeEnumWithTitles(item);
    }

    if (request.params.optionName === "highlightDataSeries") {
      return {
        enum: getHighlightSeriesEnum(item),
        enum_titles: getHighlightSeriesEnumTitles(item)
      };
    }

    if (request.params.optionName === "highlightDataRows") {
      return {
        enum: getHighlightRowsEnum(item),
        enum_titles: getHighlightRowsEnumTitles(item)
      };
    }

    if (request.params.optionName === "prognosisStart") {
      return {
        enum: getPrognosisStartEnum(item),
        enum_titles: getPrognosisStartEnumTitles(item)
      };
    }

    return Boom.badRequest();
  }
};
