const Joi = require("joi");
const GermanTranslation = require("../locales/de/translation.json");
const EnglishTranslation = require("../locales/en/translation.json");

module.exports = {
  path: "/locales/{lng}/translation.json",
  method: "GET",
  options: {
    description: "Returns translations for given language",
    tags: ["api"],
    validate: {
      params: {
        lng: Joi.string().required()
      }
    }
  },
  handler: (request, h) => {
    if (request.params.lng === "de") {
      return JSON.stringify(GermanTranslation);
    }
    return JSON.stringify(EnglishTranslation);
  }
};
