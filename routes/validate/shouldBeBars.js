const Joi = require("joi");
const Boom = require("boom");
const dateSeries = require("../../helpers/dateSeries.js");

module.exports = {
  method: "POST",
  path: "/validate/shouldBeBars",
  options: {
    validate: {
      options: {
        allowUnknown: true
      },
      payload: {
        data: Joi.any().required()
      }
    },
    cors: true,
    cache: {
      expiresIn: 1000 * 60 // 60 seconds
    },
    tags: ["api"]
  },
  handler: function(request, h) {
    const data = request.payload.data[0];
    const chartType = request.payload.data[1];
    const isBarChart = request.payload.data[2];
    const forceBarsOnSmall = request.payload.data[3];

    const validationResult = {
      showNotification: false,
      priority: {
        type: "medium",
        value: 50
      }
    };
    if (
      data[0] &&
      ["Bar", "StackedBar"].includes(chartType) &&
      !isBarChart &&
      !forceBarsOnSmall
    ) {
      validationResult.showNotification =
        data[0].length > 8 && !dateSeries.isDateSeriesData(data);
    }
    return validationResult;
  }
};
