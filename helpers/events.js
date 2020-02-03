const chartType = require("./chartType.js");
const dateSeries = require("./dateSeries.js");

function availableForItem(item) {
  if (
    chartType.isBarChart(item) ||
    chartType.isStackedBarChart(item) ||
    chartType.isLineChart(item) ||
    chartType.isAreaChart(item)
  ) {
    const serie = dateSeries.getFirstColumnSerie(item.data);
    return dateSeries.isDateSeries(serie);
  }
  return false;
}

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

function parseEvents(item) {
  if (!item.events || !availableForItem(item)) {
    return [];
  }
  const events = cloneEvents(item.events);
  convertDateObjects(events);
  sortByDate(events);
  return events;
}

function getAllDates(events) {
  const allDates = [];
  events.forEach(event => {
    dateFieldsForEvent(event).forEach(dateField => {
      allDates.push(event[dateField]);
    });
  });
  return allDates;
}

function extendWithEventDates(originalData, events) {
  if (!events) {
    events = [];
  }
  const data = [...originalData];
  const dateRange = dateSeries.getFirstAndLastDateFromData(data);
  getAllDates(events).forEach(date => {
    if (date < dateRange.first || date > dateRange.last) {
      // Put event date in first column, add second column with "null" data to ensure that the row is taken into account
      // for the x axis scale (important if event date is before the first or after the last date of the chart data)
      const eventDateRow = [date, null];
      data.push(eventDateRow);
    }
  });
  return data;
}

function vegaSpecData(events) {
  const pointEventValues = [];
  const rangeEventValues = [];

  events.forEach((event, index) => {
    if (event.type === "point") {
      const { date } = event;
      pointEventValues.push({ index, date });
    } else if (event.type === "range") {
      const { dateFrom, dateTo } = event;
      rangeEventValues.push({ index, dateFrom, dateTo });
    }
  });

  return [
    {
      name: "events-point",
      values: pointEventValues
    },
    {
      name: "events-range",
      values: rangeEventValues
    }
  ];
}

const verticalMarks = [
  {
    name: "events-range-from-to",
    type: "rule",
    from: { data: "events-range" },
    encode: {
      enter: {
        x: { signal: "floor(scale('xScale', datum.dateFrom)) + 0.5" },
        x2: { signal: "floor(scale('xScale', datum.dateTo)) + 0.5" },
        y: { value: -17.5 },
        stroke: { value: "#6e6e7e" },
        strokeWidth: { value: 1 }
      }
    }
  },
  {
    name: "events-range-from",
    type: "rule",
    from: { data: "events-range-from-to" },
    encode: {
      enter: {
        x: { field: "x" },
        y: { value: -17 },
        y2: { field: { group: "height", level: 1 } },
        stroke: { value: "#fff" },
        strokeOpacity: { value: 0.5 },
        strokeWidth: { value: 3 }
      }
    }
  },
  {
    type: "rule",
    from: { data: "events-range-from" },
    encode: {
      enter: {
        x: { field: "x" },
        y: { value: -18 },
        y2: { field: "y2" },
        stroke: { value: "#6e6e7e" },
        strokeDash: { value: [1, 1] },
        strokeWidth: { value: 1 }
      }
    }
  },
  {
    name: "events-range-to",
    type: "rule",
    from: { data: "events-range-from-to" },
    encode: {
      enter: {
        x: { field: "x2" },
        y: { value: -17 },
        y2: { field: { group: "height", level: 1 } },
        stroke: { value: "#fff" },
        strokeOpacity: { value: 0.5 },
        strokeWidth: { value: 3 }
      }
    }
  },
  {
    type: "rule",
    from: { data: "events-range-to" },
    encode: {
      enter: {
        x: { field: "x" },
        y: { value: -18 },
        y2: { field: "y2" },
        stroke: { value: "#6e6e7e" },
        strokeDash: { value: [1, 1] },
        strokeWidth: { value: 1 }
      }
    }
  },
  {
    type: "symbol",
    from: { data: "events-range-from-to" },
    encode: {
      enter: {
        x: { signal: "(datum.x + datum.x2) / 2" },
        y: { value: -18 },
        size: { signal: "16 * 16" },
        fill: { value: "#fff" },
        stroke: { value: "#6e6e7e" },
        strokeWidth: { value: 1 }
      }
    }
  },
  {
    type: "text",
    from: { data: "events-range-from-to" },
    encode: {
      enter: {
        x: { signal: "(datum.x + datum.x2) / 2" },
        y: { value: -17 },
        align: { value: "center" },
        baseline: { value: "middle" },
        fill: { value: "#6e6e7e" },
        fontWeight: { value: "bold" },
        text: { signal: "datum.datum.index + 1" }
      }
    }
  },
  {
    name: "events-point-line",
    type: "rule",
    from: { data: "events-point" },
    encode: {
      enter: {
        x: { signal: "floor(scale('xScale', datum.date)) + 0.5" },
        y: { value: -10 },
        y2: { field: { group: "height", level: 1 } },
        stroke: { value: "#fff" },
        strokeOpacity: { value: 0.5 },
        strokeWidth: { value: 3 }
      }
    }
  },
  {
    type: "rule",
    from: { data: "events-point-line" },
    encode: {
      enter: {
        x: { field: "x" },
        y: { field: "y" },
        y2: { field: "y2" },
        stroke: { value: "#6e6e7e" },
        strokeDash: { value: [1, 1] },
        strokeWidth: { value: 1 }
      }
    }
  },
  {
    type: "symbol",
    from: { data: "events-point-line" },
    encode: {
      enter: {
        x: { field: "x" },
        y: { value: -18 },
        size: { signal: "16 * 16" },
        stroke: { value: "#6e6e7e" },
        strokeWidth: { value: 1 }
      }
    }
  },
  {
    type: "text",
    from: { data: "events-point-line" },
    encode: {
      enter: {
        x: { field: "x" },
        y: { value: -17 },
        align: { value: "center" },
        baseline: { value: "middle" },
        fill: { value: "#6e6e7e" },
        fontWeight: { value: "bold" },
        text: { signal: "datum.datum.index + 1" }
      }
    }
  }
];

const horizontalMarks = [
  {
    name: "events-range-from-to",
    type: "rule",
    from: { data: "events-range" },
    encode: {
      enter: {
        y: {
          signal:
            "floor(scale('yScale', datum.dateFrom)) + 0.5 - groupPadding / 2"
        },
        y2: {
          signal:
            "floor(scale('yScale', datum.dateTo)) + 0.5 - groupPadding / 2"
        },
        x: { field: { group: "width", level: 1 }, offset: 17.5 },
        stroke: { value: "#6e6e7e" },
        strokeWidth: { value: 1 }
      }
    }
  },
  {
    name: "events-range-from",
    type: "rule",
    from: { data: "events-range-from-to" },
    encode: {
      enter: {
        y: { field: "y" },
        x: { value: 0 },
        x2: { field: { group: "width", level: 1 }, offset: 17 },
        stroke: { value: "#fff" },
        strokeOpacity: { value: 0.5 },
        strokeWidth: { value: 3 }
      }
    }
  },
  {
    type: "rule",
    from: { data: "events-range-from" },
    encode: {
      enter: {
        y: { field: "y" },
        x: { value: 0 },
        x2: { field: "x2", offset: 1 },
        stroke: { value: "#6e6e7e" },
        strokeDash: { value: [1, 1] },
        strokeWidth: { value: 1 }
      }
    }
  },
  {
    name: "events-range-to",
    type: "rule",
    from: { data: "events-range-from-to" },
    encode: {
      enter: {
        y: { field: "y2" },
        x: { value: 0 },
        x2: { field: "x" },
        stroke: { value: "#fff" },
        strokeOpacity: { value: 0.5 },
        strokeWidth: { value: 3 }
      }
    }
  },
  {
    type: "rule",
    from: { data: "events-range-to" },
    encode: {
      enter: {
        y: { field: "y" },
        x: { value: 0 },
        x2: { field: "x2", offset: 1 },
        stroke: { value: "#6e6e7e" },
        strokeDash: { value: [1, 1] },
        strokeWidth: { value: 1 }
      }
    }
  },
  {
    type: "symbol",
    from: { data: "events-range-from-to" },
    encode: {
      enter: {
        y: { signal: "(datum.y + datum.y2) / 2" },
        x: { field: "x", offset: 0.5 },
        size: { signal: "16 * 16" },
        fill: { value: "#fff" },
        stroke: { value: "#6e6e7e" },
        strokeWidth: { value: 1 }
      }
    }
  },
  {
    type: "text",
    from: { data: "events-range-from-to" },
    encode: {
      enter: {
        y: { signal: "(datum.y + datum.y2) / 2 + 1" },
        x: { field: "x", offset: 0.5 },
        align: { value: "center" },
        baseline: { value: "middle" },
        fill: { value: "#6e6e7e" },
        fontWeight: { value: "bold" },
        text: { signal: "datum.datum.index + 1" }
      }
    }
  },
  {
    name: "events-point-line",
    type: "rule",
    from: { data: "events-point" },
    encode: {
      enter: {
        y: {
          signal: "floor(scale('yScale', datum.date)) + 0.5 - groupPadding / 2"
        },
        x: { value: 0 },
        x2: { field: { group: "width", level: 1 }, offset: 10 },
        stroke: { value: "#fff" },
        strokeOpacity: { value: 0.5 },
        strokeWidth: { value: 3 }
      }
    }
  },
  {
    type: "rule",
    from: { data: "events-point-line" },
    encode: {
      enter: {
        y: { field: "y" },
        x: { field: "x" },
        x2: { field: "x2" },
        stroke: { value: "#6e6e7e" },
        strokeDash: { value: [1, 1] },
        strokeWidth: { value: 1 }
      }
    }
  },
  {
    type: "symbol",
    from: { data: "events-point-line" },
    encode: {
      enter: {
        y: { field: "y" },
        x: { field: "x2", offset: 8 },
        size: { signal: "16 * 16" },
        stroke: { value: "#6e6e7e" },
        strokeWidth: { value: 1 }
      }
    }
  },
  {
    type: "text",
    from: { data: "events-point-line" },
    encode: {
      enter: {
        y: { field: "y", offset: 1 },
        x: { field: "x2", offset: 8 },
        align: { value: "center" },
        baseline: { value: "middle" },
        fill: { value: "#6e6e7e" },
        fontWeight: { value: "bold" },
        text: { signal: "datum.datum.index + 1" }
      }
    }
  }
];

module.exports = {
  availableForItem,
  extendWithEventDates,
  getAllDates,
  parseEvents,
  vegaSpecData,
  verticalMarks,
  horizontalMarks
};
