const Joi = require("joi");
const Boom = require("boom");
const dateSeries = require("../../helpers/dateSeries.js");

module.exports = {
  method: "POST",
  path: "/notification/shouldBeLineChart",
  options: {
    validate: {
      options: {
        allowUnknown: true
      },
      payload: {
        data: Joi.any().required(),
        notificationCheck: Joi.object().required()
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
    const notificationResult = {
      showNotification: false,
      priority: request.payload.notificationCheck.priority
    };
    if (chartType !== "Line" && data[0]) {
      notificationResult.showNotification =
        data[0].length > request.payload.notificationCheck.limit &&
        dateSeries.isDateSeriesData(data);
    }
    return notificationResult;
  }
};
