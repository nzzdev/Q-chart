const Joi = require("@hapi/joi");
const helpers = require("../../helpers/dateSeries.js");

module.exports = {
  method: "POST",
  path: "/notification/supportedDateFormat",
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
      if (helpers.isDateSeriesData(item.data)) {
        return {
          message: {
            title: "notifications.supportedDateFormat.title",
            body: "notifications.supportedDateFormat.body",
          },
        };
      }

      return null;
    } catch (err) {
      return null;
    }
  },
};
