const Joi = require("joi");
const Boom = require("boom");
const dateSeries = require("../../helpers/dateSeries.js");
const validationConfig = JSON.parse(process.env.VALIDATION_CONFIG);

module.exports = {
  method: "POST",
  path: "/validate/shouldBeLineChart",
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
    const validationResult = {
      showNotification: false,
      priority: validationConfig.shouldBeLineChart.priority
    };
    if (chartType !== "Line" && data[0]) {
      validationResult.showNotification =
        data[0].length > validationConfig.shouldBeLineChart.limit &&
        dateSeries.isDateSeriesData(data);
    }
    return validationResult;
  }
};
