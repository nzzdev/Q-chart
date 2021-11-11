const Joi = require("joi");
const dateSeries = require("../../helpers/dateSeries.js");

module.exports = {
  method: "POST",
  path: "/notification/hideAxisLabel",
  options: {
    validate: {
      options: {
        allowUnknown: true,
      },
      payload: Joi.object().required(),
    },
    cache: {
      expiresIn: 1000 * 60, // 60 seconds
    },
    tags: ["api"],
  },
  handler: function (request, h) {
    try {
      const item = request.payload.item;
      if (
        !item.options.hideAxisLabel &&
        dateSeries.isDateSeriesData(item.data)
      ) {
        return {
          message: {
            title: "notifications.hideAxisLabel.title",
            body: "notifications.hideAxisLabel.body",
          },
        };
      }
      return null;
    } catch (err) {
      return null;
    }
  },
};
