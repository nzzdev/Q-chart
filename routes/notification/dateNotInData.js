const Joi = require("@hapi/joi");
const eventHelpers = require("../../helpers/events.js");
const dateSeries = require("../../helpers/dateSeries.js");
const { isBarChart, isStackedBarChart } = require("../../helpers/chartType.js");

module.exports = {
  method: "POST",
  path: "/notification/dateNotInData",
  options: {
    validate: {
      options: {
        allowUnknown: true
      },
      payload: Joi.object().required()
    },
    cors: true,
    tags: ["api"]
  },
  handler: function(request, h) {
    try {
      const { item } = request.payload;

      if (isBarChart(item) || isStackedBarChart(item)) {
        const events = eventHelpers.parseEvents(item);
        const eventsWithDateInData = eventHelpers.filterEventsWithDateInData(
          events,
          item.data
        );

        if (eventsWithDateInData.length !== events.length) {
          return {
            message: {
              title: "notifications.dateNotInData.title",
              body: "notifications.dateNotInData.body"
            }
          };
        }
      }

      return null;
    } catch (err) {
      return null;
    }
  }
};
