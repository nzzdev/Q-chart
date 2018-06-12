const Joi = require("joi");
const Boom = require("boom");
const dateSeries = require("../../helpers/dateSeries.js");

module.exports = {
  method: "POST",
  path: "/notification/shouldBeBars",
  options: {
    validate: {
      options: {
        allowUnknown: true
      },
      payload: {
        data: Joi.any().required(),
        notificationRule: Joi.object().required()
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

    const notificationResult = {
      showNotification: false,
      priority: request.payload.notificationRule.priority
    };
    if (
      data[0] &&
      ["Bar", "StackedBar"].includes(chartType) &&
      !isBarChart &&
      !forceBarsOnSmall
    ) {
      notificationResult.showNotification =
        data[0].length > request.payload.notificationRule.limit &&
        !dateSeries.isDateSeriesData(data);
    }
    return notificationResult;
  }
};
