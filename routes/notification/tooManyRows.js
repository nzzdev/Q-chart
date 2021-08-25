const Joi = require("joi");
const array2d = require("array2d");

module.exports = {
  method: "POST",
  path: "/notification/tooManyRows",
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
      const options = request.payload.options;
      const amountOfRows = array2d.height(item.data);
      if (
        item.data[0] &&
        amountOfRows > options.limit
      ) {
        return {
          message: {
            title: "notifications.tooManyRows.title",
            body: "notifications.tooManyRows.body",
          },
        };
      }
      return null;
    } catch (err) {
      return null;
    }
  },
};
