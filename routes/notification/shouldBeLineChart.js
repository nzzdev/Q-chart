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
      chartType !== "Line" &&
      data[0] &&
      data[0].length > request.payload.options.limit &&
      dateSeries.isDateSeriesData(data)
    ) {
      return {
        message: {
          title: "notifications.shouldBeLineChart.title",
          body: "notifications.shouldBeLineChart.body"
        }
      };
    }
    return null;
  }
};
