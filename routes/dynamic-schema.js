const Boom = require("boom");
const Joi = require("joi");

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

    if (request.params.optionName === "highlighDataRowsItem") {
      try {
        return {
          title: `${item.data[0][0]} wählen`
        };
      } catch {
        return {};
      }
    }

    return Boom.badRequest();
  }
};
