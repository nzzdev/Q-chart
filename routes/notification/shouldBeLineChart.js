const Joi = require("joi");
const Boom = require("boom");
const array2d = require("array2d");
const dateSeries = require("../../helpers/dateSeries.js");

module.exports = {
  method: "POST",
  path: "/notification/shouldBeLineChart",
  options: {
    validate: {
      options: {
        allowUnknown: true
      },
      payload: Joi.object().required()
    },
    cors: true,
    tags: ["api"]
  },
  handler: function(request, h) {
    try {
      const item = request.payload.item;
      const options = request.payload.options;
      const amountOfRows = array2d.height(item.data);
      if (
        item.options.chartType !== "Line" &&
        item.data[0] &&
        amountOfRows > options.limit &&
        dateSeries.isDateSeriesData(item.data)
      ) {
        return {
          message: {
            title: "notifications.shouldBeLineChart.title",
            body: "notifications.shouldBeLineChart.body"
          }
        };
      }
      return null;
    } catch (err) {
      return null;
    }
  }
};
