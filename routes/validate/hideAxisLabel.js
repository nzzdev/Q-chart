const Joi = require("joi");
const Boom = require("boom");

module.exports = {
  method: "POST",
  path: "/validate/hideAxisLabel",
  options: {
    validate: {
      options: {
        allowUnknown: true
      },
      payload: {
        data: Joi.any().required()
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
    const validationResult = {
      showNotification: false,
      priority: "medium"
    };
    if (data[0] && data[0][0]) {
      validationResult.showNotification = ["Date", "Datum"].includes(
        data[0][0]
      );
    }
    return validationResult;
  }
};
