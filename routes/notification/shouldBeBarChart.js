const Joi = require("joi");

module.exports = {
  method: "POST",
  path: "/notification/shouldBeBarChart",
  options: {
    validate: {
      options: {
        allowUnknown: true,
      },
      payload: Joi.object().required(),
    },
    cors: true,
    tags: ["api"],
  },
  handler: function (request, h) {
    try {
      const item = request.payload.item;
      const options = request.payload.options;
      if (
        item.options.chartType === "StackedBar" &&
        item.data[0].length === options.limit
      ) {
        return {
          message: {
            title: "notifications.shouldBeBarChart.title",
            body: "notifications.shouldBeBarChart.body",
          },
        };
      }
      return null;
    } catch (err) {
      return null;
    }
  },
};
