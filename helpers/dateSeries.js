const array2d = require("array2d");
const clone = require("clone");

const moment = require("moment-timezone");
const timezone = process.env.TIMEZONE || "Europe/Zurich";

const differenceInSeconds = require("date-fns/differenceInSeconds");
const isBefore = require("date-fns/isBefore");
const isAfter = require("date-fns/isAfter");

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
    d3format: "%B %Y",
    getDate: parsed => {
      return new Date(parsed[1], (parsed[2] - 1) * 3, 1);
    }
  },
  "Q-YYYY": {
    match: /^ *[qQ]([1234])[ \-\/][12]\d{3} *$/,
    parse: /^ *[qQ]([1234])[ \-\/](\d{4}) *$/,
    d3format: "%B %Y",
    getDate: parsed => {
      return new Date(parsed[2], (parsed[1] - 1) * 3, 1);
    }
  },
  "YYYY-M": {
    match: /^ *([12]\d{3}) ?[ \-\/\.mM](0?[1-9]|1[0-2]) *$/,
    parse: /^ *(\d{4}) ?[ \-\/\.mM](0?[1-9]|1[0-2]) *$/,
    d3format: "%B %Y",
    getDate: parsed => {
      return new Date(parsed[1], parsed[2] - 1, 1);
    }
  },
  "M-YYYY": {
    match: /^ *(0?[1-9]|1[0-2]) ?[ \-\/\.][12]\d{3} *$/,
    parse: /^ *(0?[1-9]|1[0-2]) ?[ \-\/\.](\d{4}) *$/,
    d3format: "%B %Y",
    getDate: parsed => {
      return new Date(parsed[2], parsed[1] - 1, 1);
    }
  },
  "YYYY-WW": {
    match: /^ *[12]\d{3}[ -]?[wW](0?[1-9]|[1-4]\d|5[0-3]) *$/,
    parse: /^ *(\d{4})[ -]?[wW](0?[1-9]|[1-4]\d|5[0-3]) *$/,
    d3format: "%d.%m.%Y",
    getDate: parsed => {
      return dateFromIsoWeek(parsed[1], parsed[2], 1);
    }
  },
  "YYYY-WW-d": {
    match: /^ *[12]\d{3}[ \-]?[wW](0?[1-9]|[1-4]\d|5[0-3])(?:[ \-]?[1-7]) *$/,
    parse: /^ *(\d{4})[ \-]?[wW](0?[1-9]|[1-4]\d|5[0-3])(?:[ \-]?([1-7])) *$/,
    d3format: "%d.%m.%Y",
    getDate: parsed => {
      return dateFromIsoWeek(parsed[1], parsed[2], parsed[3]);
    }
  },
  "MM/DD/YYYY": {
    match: /^ *(0?[1-9]|1[0-2])([\-\/] ?)(0?[1-9]|[1-2]\d|3[01])\2([12]\d{3})$/,
    parse: /^ *(0?[1-9]|1[0-2])([\-\/] ?)(0?[1-9]|[1-2]\d|3[01])\2(\d{4})$/,
    d3format: "%d.%m.%Y",
    getDate: parsed => {
      return new Date(parsed[4], parsed[1] - 1, parsed[3]);
    }
  },
  "DD/MM/YYYY": {
    match: /^ *(0?[1-9]|[1-2]\d|3[01])([\-\.\/ ?])(0?[1-9]|1[0-2])\2([12]\d{3})$/,
    parse: /^ *(0?[1-9]|[1-2]\d|3[01])([\-\.\/ ?])(0?[1-9]|1[0-2])\2(\d{4})$/,
    d3format: "%d.%m.%Y",
    getDate: parsed => {
      return new Date(parsed[4], parsed[3] - 1, parsed[1]);
    }
  },
  "YYYY-MM-DD": {
    match: /^ *([12]\d{3})([\-\/\. ?])(0?[1-9]|1[0-2])\2(0?[1-9]|[1-2]\d|3[01])$/,
    parse: /^ *(\d{4})([\-\/\. ?])(0?[1-9]|1[0-2])\2(0?[1-9]|[1-2]\d|3[01])$/,
    d3format: "%d.%m.%Y",
    getDate: parsed => {
      return new Date(parsed[1], parsed[3] - 1, parsed[4]);
    }
  },
  "MM/DD/YYYY HH:MM": {
    match: /^ *(0?[1-9]|1[0-2])([-\/] ?)(0?[1-9]|[1-2]\d|3[01])\2([12]\d{3}) *[ \-\|] *(0?\d|1\d|2[0-3]):([0-5]\d) *$/,
    parse: /^ *(0?[1-9]|1[0-2])([-\/] ?)(0?[1-9]|[1-2]\d|3[01])\2(\d{4}) *[ \-\|] *(0?\d|1\d|2[0-3]):([0-5]\d) *$/,
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

function getFirstAndLastDateFromData(data) {
  const parsedDatesData = getDataWithDateParsed(data);
  const dates = getFirstColumnSerie(parsedDatesData);
  const sortedDates = dates.sort((a, b) => {
    return a < b ? -1 : a > b ? 1 : 0;
  });
  const firstDate = sortedDates.shift();
  const lastDate = sortedDates.pop();
  return {
    first: firstDate,
    last: lastDate
  };
}

function getIntervalForData(data) {
  const { first, last } = getFirstAndLastDateFromData(data);
  const diffSeconds = differenceInSeconds(last, first);

  // 2 years
  if (diffSeconds > 2 * 365 * 24 * 60 * 60) {
    return "year";
  }
  // 3 months
  if (diffSeconds > 3 * 30 * 24 * 60 * 60) {
    return "month";
  }
  // 3 days
  if (diffSeconds > 3 * 24 * 60 * 60) {
    return "day";
  }
  // 3 hours
  if (diffSeconds > 3 * 60 * 60) {
    return "hour";
  }
  // 3 minutes
  if (diffSeconds > 3 * 60) {
    return "minute";
  }
  return "second";
}

// intervals are used to set the tickCount and format the date on the X axis
// the user chooses a specific interval via an option
const intervals = {
  year: {
    d3format: "%Y",
    vegaInterval: { interval: "year", step: 1 },
    getFirstStepDateAfterDate: function(date) {
      const year = date.getFullYear();
      const firstOfJanuarySameYear = new Date(year, 0, 1);
      if (isBefore(firstOfJanuarySameYear, date)) {
        return new Date(year + 1, 0, 1);
      } else {
        return firstOfJanuarySameYear;
      }
    },
    getLastStepDateBeforeDate: function(date) {
      const year = date.getFullYear();
      const firstOfJanuarySameYear = new Date(year, 0, 1);
      if (isAfter(firstOfJanuarySameYear, date)) {
        return new Date(year - 1, 0, 1);
      } else {
        return firstOfJanuarySameYear;
      }
    }
  },
  quarter: {
    // the formatFunction is only used for the legend for now
    // there is no easy way to teach the time formatter in vega about quarters
    formatFunction: date => {
      return (
        "Q" + Math.floor(date.getMonth() / 3 + 1) + " " + date.getFullYear()
      );
    },
    d3format: "%b %Y",
    vegaInterval: { interval: "month", step: 3 },
    getFirstStepDateAfterDate: function(date) {
      const year = date.getFullYear();
      const month = date.getMonth();
      const quarter = Math.floor(date.getMonth() / 3 + 1);
      const firstMonthOfQuarter = (quarter - 1) * 3 + 1;
      const firstOfTheSameQuarter = new Date(year, firstMonthOfQuarter, 1);
      if (isBefore(firstOfTheSameQuarter, date)) {
        return new Date(year, firstMonthOfQuarter + 3, 1);
      } else {
        return firstOfTheSameQuarter;
      }
    },
    getLastStepDateBeforeDate: function(date) {
      const year = date.getFullYear();
      const month = date.getMonth();
      const quarter = Math.floor(date.getMonth() / 3 + 1);
      const firstMonthOfQuarter = (quarter - 1) * 3 + 1;
      const firstOfTheSameQuarter = new Date(year, firstMonthOfQuarter, 1);
      if (isAfter(firstOfTheSameQuarter, date)) {
        return new Date(year, firstMonthOfQuarter - 3, 1);
      } else {
        return firstOfTheSameQuarter;
      }
    }
  },
  month: {
    d3format: "%b %Y",
    vegaInterval: { interval: "month", step: 1 },
    getFirstStepDateAfterDate: function(date) {
      const year = date.getFullYear();
      const month = date.getMonth();
      const firstOfTheSameMonth = new Date(year, month, 1);
      if (isBefore(firstOfTheSameMonth, date)) {
        return new Date(year, month + 1, 1);
      } else {
        return firstOfTheSameMonth;
      }
    },
    getLastStepDateBeforeDate: function(date) {
      const year = date.getFullYear();
      const month = date.getMonth();
      const firstOfTheSameMonth = new Date(year, month, 1);
      if (isAfter(firstOfTheSameMonth, date)) {
        return new Date(year, month - 1, 1);
      } else {
        return firstOfTheSameMonth;
      }
    }
  },
  day: {
    d3format: "%d.%m.%Y",
    vegaInterval: { interval: "day", step: 1 },
    getFirstStepDateAfterDate: function(date) {
      const year = date.getFullYear();
      const month = date.getMonth();
      const day = date.getDate();
      const beginningOfTheSameDate = new Date(year, month, day, 0, 0, 0);
      if (isBefore(beginningOfTheSameDate, date)) {
        return new Date(year, month, day + 1);
      } else {
        return beginningOfTheSameDate;
      }
    },
    getLastStepDateBeforeDate: function(date) {
      const year = date.getFullYear();
      const month = date.getMonth();
      const day = date.getDate();
      const beginningOfTheSameDate = new Date(year, month, day, 0, 0, 0);
      if (isAfter(beginningOfTheSameDate, date)) {
        return new Date(year, month, day - 1);
      } else {
        return beginningOfTheSameDate;
      }
    }
  },
  hour: {
    d3format: "%d.%m. %H Uhr",
    vegaInterval: { interval: "hour", step: 1 },
    getFirstStepDateAfterDate: function(date) {
      const year = date.getFullYear();
      const month = date.getMonth();
      const day = date.getDate();
      const hour = date.getHours();
      const beginningOfTheSameHour = new Date(year, month, day, hour, 0, 0);
      if (isBefore(beginningOfTheSameHour, date)) {
        return new Date(year, month, day, hour + 1);
      } else {
        return beginningOfTheSameHour;
      }
    },
    getLastStepDateBeforeDate: function(date) {
      const year = date.getFullYear();
      const month = date.getMonth();
      const day = date.getDate();
      const hour = date.getHours();
      const beginningOfTheSameHour = new Date(year, month, day, hour, 0, 0);
      if (isAfter(beginningOfTheSameHour, date)) {
        return new Date(year, month, day, hour - 1);
      } else {
        return beginningOfTheSameHour;
      }
    }
  },
  minute: {
    d3format: "%d.%m. %H:%M Uhr",
    vegaInterval: { interval: "hour", step: 1 },
    getFirstStepDateAfterDate: function(date) {
      const year = date.getFullYear();
      const month = date.getMonth();
      const day = date.getDate();
      const hour = date.getHours();
      const minute = date.getMinutes();
      const beginningOfTheSameMinute = new Date(
        year,
        month,
        day,
        hour,
        minute,
        0
      );
      if (isBefore(beginningOfTheSameMinute, date)) {
        return new Date(year, month, day, hour, minute + 1);
      } else {
        return beginningOfTheSameMinute;
      }
    },
    getLastStepDateBeforeDate: function(date) {
      const year = date.getFullYear();
      const month = date.getMonth();
      const day = date.getDate();
      const hour = date.getHours();
      const minute = date.getMinutes();
      const beginningOfTheSameMinute = new Date(
        year,
        month,
        day,
        hour,
        minute,
        0
      );
      if (isAfter(beginningOfTheSameMinute, date)) {
        return new Date(year, month, day, hour, minute - 1);
      } else {
        return beginningOfTheSameMinute;
      }
    }
  },
  second: {
    d3format: "%d.%m. %H:%M:%S Uhr",
    vegaInterval: { interval: "hour", step: 1 },
    getFirstStepDateAfterDate: function(date) {
      const year = date.getFullYear();
      const month = date.getMonth();
      const day = date.getDate();
      const hour = date.getHours();
      const minute = date.getMinutes();
      const second = date.getSeconds();
      const beginningOfTheSameSecond = new Date(
        year,
        month,
        day,
        hour,
        minute,
        second
      );
      if (isBefore(beginningOfTheSameSecond, date)) {
        return new Date(year, month, day, hour, minute, second + 1);
      } else {
        return beginningOfTheSameSecond;
      }
    },
    getLastStepDateBeforeDate: function(date) {
      const year = date.getFullYear();
      const month = date.getMonth();
      const day = date.getDate();
      const hour = date.getHours();
      const minute = date.getMinutes();
      const beginningOfTheSameSecond = new Date(
        year,
        month,
        day,
        hour,
        minute,
        second
      );
      if (isAfter(beginningOfTheSameSecond, date)) {
        return new Date(year, month, day, hour, minute, second - 1);
      } else {
        return beginningOfTheSameSecond;
      }
    }
  }
};

module.exports = {
  dateFormats,
  isDateSeries,
  isDateSeriesData,
  getFirstColumnSerie,
  getDateFormatForSerie,
  getDateFormatForValue,
  getDataWithDateParsed,
  getFirstAndLastDateFromData,
  getIntervalForData,
  getDateFormatForData,
  intervals
};
