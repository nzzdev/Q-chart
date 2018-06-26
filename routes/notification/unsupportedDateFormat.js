const Joi = require("joi");
const helpers = require("../../helpers/dateSeries.js");

const separators = [",", "/", "-"];

module.exports = {
  method: "POST",
  path: "/notification/unsupportedDateFormat",
  options: {
    validate: {
      options: {
        allowUnknown: true
      },
      payload: {
        data: Joi.array().required()
      }
    },
    cors: true,
    tags: ["api"]
  },
  handler: function(request, h) {
    const data = request.payload.data[0];
    // if this is a correct date series, we do not have a problem
    if (helpers.isDateSeriesData(data)) {
      return null;
    }

    // a wrong date format is detected by strings with two dots or slashes or dashes separating numbers
    for (let row of data.slice(1)) {
      for (let separator of separators) {
        let parts = row[0].split(separator);
        if (
          parts.length !== 3 &&
          Number.isNaN(parseInt(parts[0])) &&
          Number.isNaN(parseInt(parts[1])) &&
          Number.isNaN(parseInt(parts[2]))
        ) {
          return null;
        }
      }
    }

    return {
      message: {
        title: "notifications.unsupportedDateFormat.title",
        body: "notifications.unsupportedDateFormat.body"
      }
    };
  }
};
