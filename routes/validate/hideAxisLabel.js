const Joi = require("joi");
const Boom = require("boom");
const dateSeries = require("../../helpers/dateSeries.js");

module.exports = {
  method: "POST",
  path: "/validate/hideAxisLabel",
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
    return {
      showNotification: dateSeries.isDateSeriesData(data),
      priority: "medium"
    };
  }
};
