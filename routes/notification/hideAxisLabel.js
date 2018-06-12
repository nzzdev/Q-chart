const Joi = require("joi");
const Boom = require("boom");
const dateSeries = require("../../helpers/dateSeries.js");
const notificationConfig = JSON.parse(process.env.NOTIFICATION_CONFIG);

module.exports = {
  method: "POST",
  path: "/notification/hideAxisLabel",
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
    const hideAxisLabel = request.payload.data[1];
    const notificationResult = {
      showNotification: false,
      priority: notificationConfig.hideAxisLabel.priority
    };
    if (!hideAxisLabel) {
      notificationResult.showNotification = dateSeries.isDateSeriesData(data);
    }
    return notificationResult;
  }
};
