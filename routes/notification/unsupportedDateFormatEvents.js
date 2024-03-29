const Joi = require("joi");
const helpers = require("../../helpers/dateSeries.js");

module.exports = {
  method: "POST",
  path: "/notification/unsupportedDateFormatEvents",
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
      const { events } = request.payload.item;

      for (let event of events) {
        const eventDates = [];
        if (event.type === "point") {
          eventDates.push(event.date);
        }
        if (event.type === "range") {
          eventDates.push(event.dateFrom, event.dateTo);
        }
        for (let eventDate of eventDates) {
          if (eventDate && !helpers.getDateFormatForValue(eventDate)) {
            return {
              message: {
                title: "notifications.unsupportedDateFormatEvents.title",
                body: "notifications.unsupportedDateFormatEvents.body",
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
