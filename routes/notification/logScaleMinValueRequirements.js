const Joi = require("joi");
const dataHelpers = require("../../helpers/data.js");

module.exports = {
  method: "POST",
  path: "/notification/logScaleMinValueRequirements",
  options: {
    validate: {
      options: {
        allowUnknown: true,
      },
      payload: Joi.object().required(),
    },
    tags: ["api"],
  },
  handler: function (request, h) {
    try {
      const item = request.payload.item;
      const chartType = item.options.chartType;

      // First and foremost: cast all the floats in strings to actual floats.
      const data = dataHelpers.getDataWithStringsCastedToFloats(item.data);

      const minVal = dataHelpers.getMinValue(data);
      const yScaleType = item.options.lineChartOptions.yScaleType;

      if (chartType === "Line" && yScaleType === "log" && minVal <= 0) {
        return {
          message: {
            title: "notifications.logScaleMinValueRequirements.title",
            body: "notifications.logScaleMinValueRequirements.body",
          },
        };
      }

      return null;
    } catch (err) {
      console.log("Catch:logScaleMinValueRequirements", err);
      return null;
    }
  },
};
