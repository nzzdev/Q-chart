const Joi = require("joi");
const Boom = require("boom");

module.exports = {
  method: "POST",
  path: "/validation/sources",
  options: {
    validate: {
      options: {
        allowUnknown: true
      },
      payload: {
        data: Joi.any().required(),
        schema: Joi.object().required()
      }
    },
    cors: true,
    cache: {
      expiresIn: 1000 * 60 // 60 seconds
    },
    tags: ["api"]
  },
  handler: function(request, h) {
    return JSON.stringify({
      priority: {
        name: "medium",
        value: 1
      },
      message: {
        title: "Keine Quelle erfasst",
        body: "Bist du sicher, dass es keine Quellenangabe benötigt?"
      }
    });
  }
};
