const Joi = require("joi");

module.exports = {
  method: "POST",
  path: "/notification/checkMinValueYAxisLogScale",
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
      const yScaleType = item .options.yScaleType;
      const minVal = item.options.lineChartOptions.minValue;

      if (yScaleType === "log" && minVal <= 0) {
        return {
          message: {
            title: "notifications.checkMinValueYAxisLogScale.title",
            body: "notifications.checkMinValueYAxisLogScale.body",
          },
        };
      }

      return null;
    } catch (err) {
      console.log("Catch:checkMinValueYAxisLogScale", err);
      return null;
    }
  },
};
