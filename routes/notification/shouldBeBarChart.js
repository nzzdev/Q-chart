const Joi = require("joi");
const Boom = require("boom");

module.exports = {
  method: "POST",
  path: "/notification/shouldBeBarChart",
  options: {
    validate: {
      options: {
        allowUnknown: true
      },
      payload: {
        data: Joi.array().required(),
        options: Joi.object().required()
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
    if (
      chartType === "StackedBar" &&
      data[0].length === request.payload.options.limit
    ) {
      return {
        message: {
          title: "notifications.shouldBeBarChart.title",
          body: "notifications.shouldBeBarChart.body"
        }
      };
    }
    return null;
  }
};
