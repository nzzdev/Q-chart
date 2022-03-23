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
      const minVal = dataHelpers.getMinValue(item.data);
      const yScaleType = item.options.yScaleType;

      if (yScaleType === "log" && minVal <= 0) {
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
