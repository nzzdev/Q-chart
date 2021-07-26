const Joi = require("joi");
const dateSeries = require("../../helpers/dateSeries.js");

module.exports = {
  method: "POST",
  path: "/notification/shouldBeBars",
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
        item.data[0] &&
        ["Bar", "StackedBar"].includes(item.options.chartType) &&
        !item.options.barOptions.isBarChart &&
        !item.options.barOptions.forceBarsOnSmall &&
        item.data[0].length > options.limit &&
        !dateSeries.isDateSeriesData(item.data)
      ) {
        return {
          message: {
            title: "notifications.shouldBeBars.title",
            body: "notifications.shouldBeBars.body",
          },
        };
      }
      return null;
    } catch (err) {
      return null;
    }
  },
};
