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
        const parsedDatesData = dateSeries.getDataWithDateParsedAndSortedByDate(
          item.data
        );
        const dates = dateSeries.getFirstColumnSerie(parsedDatesData);
        const times = new Set(dates.map(date => date.getTime()));

        const events = eventHelpers.parseEvents(item);
        const eventDates = eventHelpers.getAllDates(events);

        for (let eventDate of eventDates) {
          const eventTime = eventDate.getTime();
          if (!times.has(eventTime)) {
            return {
              message: {
                title: "notifications.dateNotInData.title",
                body: "notifications.dateNotInData.body"
              }
            };
          }
        }
      }

      return null;
    } catch (err) {
      return null;
    }
  }
};
