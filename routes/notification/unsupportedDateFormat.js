const Joi = require("joi");
const helpers = require("../../helpers/dateSeries.js");

const separators = [".", "/", "-"];

module.exports = {
  method: "POST",
  path: "/notification/unsupportedDateFormat",
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
      // if this is a correct date series, we do not have a problem
      if (helpers.isDateSeriesData(item.data)) {
        return null;
      }

      // a wrong date format is detected by strings with two dots or slashes or dashes separating numbers
      for (let separator of separators) {
        for (let row of item.data.slice(1)) {
          let parts = row[0].split(separator);
          if (
            parts.length === 3 &&
            !Number.isNaN(parseInt(parts[0])) &&
            !Number.isNaN(parseInt(parts[1])) &&
            !Number.isNaN(parseInt(parts[2]))
          ) {
            return {
              message: {
                title: "notifications.unsupportedDateFormat.title",
                body: "notifications.unsupportedDateFormat.body",
              },
            };
          }
        }
      }
      return null;
    } catch (err) {
      return null;
    }
  },
};
