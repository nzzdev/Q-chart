const dateSeries = require("./dateSeries.js");

function dateFieldsForEvent(event) {
  if (event.type === "point") {
    return ["date"];
  } else if (event.type === "range") {
    return ["dateFrom", "dateTo"];
  }
  return [];
}

function cloneEvents(originalEvents) {
  return originalEvents.map(originalEvent => {
    return { ...originalEvent };
  });
}

function convertDateObjects(events) {
  events.forEach(event => {
    dateFieldsForEvent(event).forEach(dateField => {
      const format =
        dateSeries.dateFormats[
          dateSeries.getDateFormatForValue(event[dateField])
        ];
      event[dateField] = format.getDate(event[dateField].match(format.parse));
    });
  });
}

function sortByDate(events) {
  events.sort((a, b) => (a.date || a.dateFrom) - (b.date || b.dateFrom));
}

function parseEvents(originalEvents) {
  const events = cloneEvents(originalEvents);
  convertDateObjects(events);
  sortByDate(events);
  return events;
}

function extendWithEventDates(data, events) {
  const dateRange = dateSeries.getFirstAndLastDateFromData(data);
  events.forEach(event => {
    dateFieldsForEvent(event).forEach(dateField => {
      const date = event[dateField];
      if (date < dateRange.first || date > dateRange.last) {
        // Put event date in first column, add second column with "null" data to ensure that the row is taken into account
        // for the x axis scale (important if event date is before the first or after the last date of the chart data)
        const eventDateRow = [date, null];
        data.push(eventDateRow);
      }
    });
  });
}

module.exports = {
  extendWithEventDates,
  parseEvents
};
