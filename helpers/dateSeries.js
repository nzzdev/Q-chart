const array2d = require("array2d");
const clone = require("clone");

const moment = require("moment-timezone");
const timezone = process.env.TIMEZONE || "Europe/Zurich";

function dateFromIsoWeek(year, week, day) {
  var d = new Date(Date.UTC(year, 0, 3));
  d.setUTCDate(3 - d.getUTCDay() + (week - 1) * 7 + parseInt(day, 10));
  return d;
}

// thanks datawrapper.de for the format regexes
// https://github.com/datawrapper/datawrapper/blob/9ddb90af4aab4b071b6cba195532edea0527b3be/dw.js/src/dw.column.types.js
const dateFormats = {
  YYYY: {
    match: /^ *(?:1[0-9]|2[0-9])\d{2} *$/,
    parse: /^ *(\d{4}) *$/,
    interval: "year",
    d3format: "%Y",
    getDate: parsed => {
      return new Date(parsed[1], 0, 1);
    }
  },
  "YYYY-H": {
    match: /^ *[12]\d{3}[ \-\/]?[hH][12] *$/,
    parse: /^ *(\d{4})[ \-\/]?[hH]([12]) *$/,
    interval: "month",
    d3format: "%B %Y",
    getDate: parsed => {
      return new Date(parsed[1], (parsed[2] - 1) * 6, 1);
    }
  },
  "H-YYYY": {
    match: /^ *[hH][12][ \-\/][12]\d{3} *$/,
    parse: /^ *[hH]([12])[ \-\/](\d{4}) *$/,
    interval: "month",
    d3format: "%B %Y",
    getDate: parsed => {
      return new Date(parsed[2], (parsed[1] - 1) * 6, 1);
    }
  },
  "YYYY-Q": {
    match: /^ *[12]\d{3}[ \-\/]?[qQ][1234] *$/,
    parse: /^ *(\d{4})[ \-\/]?[qQ]([1234]) *$/,
    interval: "quarter",
    d3format: "%B %Y",
    getDate: parsed => {
      return new Date(parsed[1], (parsed[2] - 1) * 3, 1);
    }
  },
  "Q-YYYY": {
    match: /^ *[qQ]([1234])[ \-\/][12]\d{3} *$/,
    parse: /^ *[qQ]([1234])[ \-\/](\d{4}) *$/,
    interval: "quarter",
    d3format: "%B %Y",
    getDate: parsed => {
      return new Date(parsed[2], (parsed[1] - 1) * 3, 1);
    }
  },
  "YYYY-M": {
    match: /^ *([12]\d{3}) ?[ \-\/\.mM](0?[1-9]|1[0-2]) *$/,
    parse: /^ *(\d{4}) ?[ \-\/\.mM](0?[1-9]|1[0-2]) *$/,
    interval: "month",
    d3format: "%B %Y",
    getDate: parsed => {
      return new Date(parsed[1], parsed[2] - 1, 1);
    }
  },
  "M-YYYY": {
    match: /^ *(0?[1-9]|1[0-2]) ?[ \-\/\.][12]\d{3} *$/,
    parse: /^ *(0?[1-9]|1[0-2]) ?[ \-\/\.](\d{4}) *$/,
    interval: "month",
    d3format: "%B %Y",
    getDate: parsed => {
      return new Date(parsed[2], parsed[1] - 1, 1);
    }
  },
  "YYYY-WW": {
    match: /^ *[12]\d{3}[ -]?[wW](0?[1-9]|[1-4]\d|5[0-3]) *$/,
    parse: /^ *(\d{4})[ -]?[wW](0?[1-9]|[1-4]\d|5[0-3]) *$/,
    interval: "week",
    d3format: "%d.%m.%Y",
    getDate: parsed => {
      return dateFromIsoWeek(parsed[1], parsed[2], 1);
    }
  },
  "YYYY-WW-d": {
    match: /^ *[12]\d{3}[ \-]?[wW](0?[1-9]|[1-4]\d|5[0-3])(?:[ \-]?[1-7]) *$/,
    parse: /^ *(\d{4})[ \-]?[wW](0?[1-9]|[1-4]\d|5[0-3])(?:[ \-]?([1-7])) *$/,
    interval: "day",
    d3format: "%d.%m.%Y",
    getDate: parsed => {
      return dateFromIsoWeek(parsed[1], parsed[2], parsed[3]);
    }
  },
  "MM/DD/YYYY": {
    match: /^ *(0?[1-9]|1[0-2])([\-\/] ?)(0?[1-9]|[1-2]\d|3[01])\2([12]\d{3})$/,
    parse: /^ *(0?[1-9]|1[0-2])([\-\/] ?)(0?[1-9]|[1-2]\d|3[01])\2(\d{4})$/,
    interval: "day",
    d3format: "%d.%m.%Y",
    getDate: parsed => {
      return new Date(parsed[4], parsed[1] - 1, parsed[3]);
    }
  },
  "DD/MM/YYYY": {
    match: /^ *(0?[1-9]|[1-2]\d|3[01])([\-\.\/ ?])(0?[1-9]|1[0-2])\2([12]\d{3})$/,
    parse: /^ *(0?[1-9]|[1-2]\d|3[01])([\-\.\/ ?])(0?[1-9]|1[0-2])\2(\d{4})$/,
    interval: "day",
    d3format: "%d.%m.%Y",
    getDate: parsed => {
      return new Date(parsed[4], parsed[3] - 1, parsed[1]);
    }
  },
  "YYYY-MM-DD": {
    match: /^ *([12]\d{3})([\-\/\. ?])(0?[1-9]|1[0-2])\2(0?[1-9]|[1-2]\d|3[01])$/,
    parse: /^ *(\d{4})([\-\/\. ?])(0?[1-9]|1[0-2])\2(0?[1-9]|[1-2]\d|3[01])$/,
    interval: "day",
    d3format: "%d.%m.%Y",
    getDate: parsed => {
      return new Date(parsed[1], parsed[3] - 1, parsed[4]);
    }
  },
  "MM/DD/YYYY HH:MM": {
    match: /^ *(0?[1-9]|1[0-2])([-\/] ?)(0?[1-9]|[1-2]\d|3[01])\2([12]\d{3}) *[ \-\|] *(0?\d|1\d|2[0-3]):([0-5]\d) *$/,
    parse: /^ *(0?[1-9]|1[0-2])([-\/] ?)(0?[1-9]|[1-2]\d|3[01])\2(\d{4}) *[ \-\|] *(0?\d|1\d|2[0-3]):([0-5]\d) *$/,
    interval: "minute",
    d3format: "%d.%m.%Y %H:%M",
    getDate: parsed => {
      return moment
        .tz(
          new Date(
            parsed[4],
            parsed[1] - 1,
            parsed[3],
            parsed[5] || 0,
            parsed[6] || 0,
            parsed[7] || 0
          ),
          timezone
        )
        .toDate();
    }
  },
  "DD.MM.YYYY HH:MM": {
    match: /^ *(0?[1-9]|[1-2]\d|3[01])([-\.\/ ?])(0?[1-9]|1[0-2])\2([12]\d{3}) *[ \-\|] *(0?\d|1\d|2[0-3]):([0-5]\d) *$/,
    parse: /^ *(0?[1-9]|[1-2]\d|3[01])([-\.\/ ?])(0?[1-9]|1[0-2])\2(\d{4}) *[ \-\|] *(0?\d|1\d|2[0-3]):([0-5]\d) *$/,
    interval: "minute",
    d3format: "%d.%m.%Y %H:%M",
    getDate: parsed => {
      return moment
        .tz(
          new Date(
            parsed[4],
            parsed[3] - 1,
            parsed[1],
            parsed[5] || 0,
            parsed[6] || 0,
            0
          ),
          timezone
        )
        .toDate();
    }
  },
  "YYYY-MM-DD HH:MM": {
    match: /^ *([12]\d{3})([-\/\. ?])(0?[1-9]|1[0-2])\2(0?[1-9]|[1-2]\d|3[01]) *[ \-\|] *(0?\d|1\d|2[0-3]):([0-5]\d) *$/,
    parse: /^ *(\d{4})([-\/\. ?])(0?[1-9]|1[0-2])\2(0?[1-9]|[1-2]\d|3[01]) *[ \-\|] *(0?\d|1\d|2[0-3]):([0-5]\d) *$/,
    interval: "minute",
    d3format: "%d.%m.%Y %H:%M",
    getDate: parsed => {
      return moment
        .tz(
          new Date(
            parsed[1],
            parsed[3] - 1,
            parsed[4],
            parsed[5] || 0,
            parsed[6] || 0,
            0
          ),
          timezone
        )
        .toDate();
    }
  },
  "MM/DD/YYYY HH:MM:SS": {
    match: /^ *(0?[1-9]|1[0-2])([-\/] ?)(0?[1-9]|[1-2]\d|3[01])\2([12]\d{3}) *[ \-\|] *(0?\d|1\d|2[0-3]):([0-5]\d)(?::([0-5]\d))? *$/,
    parse: /^ *(0?[1-9]|1[0-2])([-\/] ?)(0?[1-9]|[1-2]\d|3[01])\2(\d{4}) *[ \-\|] *(0?\d|1\d|2[0-3]):([0-5]\d)(?::([0-5]\d))? *$/,
    interval: "second",
    d3format: "%d.%m.%Y %H:%M:S",
    getDate: parsed => {
      return moment
        .tz(
          new Date(
            parsed[4],
            parsed[1] - 1,
            parsed[3],
            parsed[5] || 0,
            parsed[6] || 0,
            0
          ),
          timezone
        )
        .toDate();
    }
  },
  "DD.MM.YYYY HH:MM:SS": {
    match: /^ *(0?[1-9]|[1-2]\d|3[01])([-\.\/ ?])(0?[1-9]|1[0-2])\2([12]\d{3}) *[ \-\|] *(0?\d|1\d|2[0-3]):([0-5]\d)(?::([0-5]\d))? *$/,
    parse: /^ *(0?[1-9]|[1-2]\d|3[01])([-\.\/ ?])(0?[1-9]|1[0-2])\2(\d{4}) *[ \-\|] *(0?\d|1\d|2[0-3]):([0-5]\d)(?::([0-5]\d))? *$/,
    interval: "second",
    d3format: "%d.%m.%Y %H:%M:S",
    getDate: parsed => {
      return moment
        .tz(
          new Date(
            parsed[4],
            parsed[3] - 1,
            parsed[1],
            parsed[5] || 0,
            parsed[6] || 0,
            parsed[7] || 0
          ),
          timezone
        )
        .toDate();
    }
  },
  "YYYY-MM-DD HH:MM:SS": {
    match: /^ *([12]\d{3})([-\/\. ?])(0?[1-9]|1[0-2])\2(0?[1-9]|[1-2]\d|3[01]) *[ \-\|] *(0?\d|1\d|2[0-3]):([0-5]\d)(?::([0-5]\d))? *$/,
    parse: /^ *(\d{4})([-\/\. ?])(0?[1-9]|1[0-2])\2(0?[1-9]|[1-2]\d|3[01]) *[ \-\|] *(0?\d|1\d|2[0-3]):([0-5]\d)(?::([0-5]\d))? *$/,
    interval: "second",
    d3format: "%d.%m.%Y %H:%M:S",
    getDate: parsed => {
      return moment
        .tz(
          new Date(
            parsed[1],
            parsed[3] - 1,
            parsed[4],
            parsed[5] || 0,
            parsed[6] || 0,
            parsed[7] || 0
          ),
          timezone
        )
        .toDate();
    }
  }
};

function getDateFormatForValue(value) {
  for (let format in dateFormats) {
    if (dateFormats[format].match.test(value)) {
      return format;
    }
  }
  return undefined;
}

function getDateFormatForSerie(serie) {
  const detectedTypeFormatsCount = {};

  for (let datapoint of serie) {
    let dateFormat = getDateFormatForValue(datapoint);
    // if we have a date format, count the occurences of each detected format
    if (!detectedTypeFormatsCount.hasOwnProperty(dateFormat)) {
      detectedTypeFormatsCount[dateFormat] = 0;
    }
    detectedTypeFormatsCount[dateFormat] =
      detectedTypeFormatsCount[dateFormat] + 1;
  }

  // sort based on counts
  const sortedFormats = Object.keys(detectedTypeFormatsCount).sort((a, b) => {
    return detectedTypeFormatsCount[b] - detectedTypeFormatsCount[a];
  });

  // return the format with most detections
  return sortedFormats[0];
}

function isDateSeries(serie) {
  for (let datapoint of serie) {
    let dateFormat = getDateFormatForValue(datapoint);
    // if any datapoint is not a detected date series, we fail here and return false.
    if (!dateFormat) {
      return false;
    }
  }
  // default: all datapoints match a date format
  return true;
}

function isDateSeriesData(data) {
  return isDateSeries(getFirstColumnSerie(data));
}

function getFirstColumnSerie(data) {
  return array2d
    .transpose(clone(data))
    .shift() // get the first column
    .slice(1); // get everything but the first cell
}

function getDateFormatForData(data) {
  return dateFormats[getDateFormatForSerie(getFirstColumnSerie(data))];
}

function getDataWithDateParsed(data) {
  const format = getDateFormatForData(data);
  return data.map((row, i) => {
    if (i === 0) {
      // the first row is just the header
      return row;
    }
    return row.map((cell, ii) => {
      if (ii !== 0) {
        // only the first cell of every row should be parsed
        return cell;
      }
      if (cell.match) {
        // check if cell is actually a string that has .match function
        return format.getDate(cell.match(format.parse));
      }
      return cell;
    });
  });
}

// intervals are used to set the tickCount and format the date on the X axis
// the user chooses a specific interval via an option
const intervals = {
  year: {
    d3format: "%Y",
    vegaInterval: { interval: "year", step: 1 }
  },
  quarter: {
    // the formatFunction is only used for the legend for now
    // there is no easy way to teach the time formatter in vega about quarters
    formatFunction: date => {
      return "Q" + (date.getMonth() / 3 + 1) + " " + date.getFullYear();
    },
    d3format: "%b %Y",
    vegaInterval: { interval: "month", step: 3 }
  },
  month: {
    d3format: "%b %Y",
    vegaInterval: { interval: "month", step: 1 }
  },
  day: {
    d3format: "%d.%m.%Y",
    vegaInterval: { interval: "day", step: 1 }
  },
  hour: {
    d3format: "%d.%m. %H Uhr",
    vegaInterval: { interval: "hour", step: 1 }
  }
};

module.exports = {
  dateFormats: dateFormats,
  isDateSeries: isDateSeries,
  isDateSeriesData: isDateSeriesData,
  getFirstColumnSerie: getFirstColumnSerie,
  getDateFormatForSerie: getDateFormatForSerie,
  getDateFormatForValue: getDateFormatForValue,
  getDataWithDateParsed: getDataWithDateParsed,
  getDateFormatForData: getDateFormatForData,
  intervals: intervals
};
