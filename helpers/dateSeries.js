const array2d = require("array2d");
const clone = require("clone");

const moment = require("moment-timezone");
const timezone = process.env.TIMEZONE || "Europe/Zurich";

const differenceInSeconds = require("date-fns/differenceInSeconds");
const isBefore = require("date-fns/isBefore");
const isAfter = require("date-fns/isAfter");
const startOfISOWeek = require("date-fns/startOfISOWeek");
const getISOWeek = require("date-fns/getISOWeek");
const setISOWeek = require("date-fns/setISOWeek");
const setISODay = require("date-fns/setISODay");
const getISOWeekYear = require("date-fns/getISOWeekYear");

const d3TimeFormat = require("d3-time-format");
const d3Config = require("../config/d3.js");
d3TimeFormat.timeFormatDefaultLocale(d3Config.timeFormatLocale);

const d3Scale = require("d3-scale");
const d3Time = require("d3-time");

function dateFromIsoWeek(year, week, day) {
  let d = new Date(year, 5, 30); // somewhere in the middle of the year
  d = setISODay(d, parseInt(day, 10));
  d = setISOWeek(d, parseInt(week, 10));
  return d;
}

// thanks datawrapper.de for the format regexes
// https://github.com/datawrapper/datawrapper/blob/9ddb90af4aab4b071b6cba195532edea0527b3be/dw.js/src/dw.column.types.js
const dateFormats = {
  YYYY: {
    match: /^ *(?:1[0-9]|2[0-9])\d{2} *$/,
    parse: /^ *(\d{4}) *$/,
    validIntervals: ["decade", "year"],
    getDate: (parsed) => {
      return new Date(parsed[1], 0, 1);
    },
  },
  "YYYY-H": {
    match: /^ *[12]\d{3}[ \-\/]?[hH][12] *$/,
    parse: /^ *(\d{4})[ \-\/]?[hH]([12]) *$/,
    validIntervals: ["decade", "year"],
    getDate: (parsed) => {
      return new Date(parsed[1], (parsed[2] - 1) * 6, 1);
    },
  },
  "H-YYYY": {
    match: /^ *[hH][12][ \-\/][12]\d{3} *$/,
    parse: /^ *[hH]([12])[ \-\/](\d{4}) *$/,
    validIntervals: ["decade", "year"],
    getDate: (parsed) => {
      return new Date(parsed[2], (parsed[1] - 1) * 6, 1);
    },
  },
  "YYYY-Q": {
    match: /^ *[12]\d{3}[ \-\/]?[qQ][1234] *$/,
    parse: /^ *(\d{4})[ \-\/]?[qQ]([1234]) *$/,
    validIntervals: ["decade", "year", "quarter"],
    getDate: (parsed) => {
      return new Date(parsed[1], (parsed[2] - 1) * 3, 1);
    },
  },
  "Q-YYYY": {
    match: /^ *[qQ]([1234])[ \-\/][12]\d{3} *$/,
    parse: /^ *[qQ]([1234])[ \-\/](\d{4}) *$/,
    validIntervals: ["decade", "year", "quarter"],
    getDate: (parsed) => {
      return new Date(parsed[2], (parsed[1] - 1) * 3, 1);
    },
  },
  "YYYY-M": {
    match: /^ *([12]\d{3}) ?[ \-\/\.mM](0?[1-9]|1[0-2]) *$/,
    parse: /^ *(\d{4}) ?[ \-\/\.mM](0?[1-9]|1[0-2]) *$/,
    validIntervals: ["decade", "year", "quarter", "month"],
    getDate: (parsed) => {
      return new Date(parsed[1], parsed[2] - 1, 1);
    },
  },
  "M-YYYY": {
    match: /^ *(0?[1-9]|1[0-2]) ?[ \-\/\.][12]\d{3} *$/,
    parse: /^ *(0?[1-9]|1[0-2]) ?[ \-\/\.](\d{4}) *$/,
    validIntervals: ["decade", "year", "quarter", "month"],
    getDate: (parsed) => {
      return new Date(parsed[2], parsed[1] - 1, 1);
    },
  },
  "YYYY-WW": {
    match: /^ *[12]\d{3}[ -]?[wW](0?[1-9]|[1-4]\d|5[0-3]) *$/,
    parse: /^ *(\d{4})[ -]?[wW](0?[1-9]|[1-4]\d|5[0-3]) *$/,
    validIntervals: ["decade", "year", "quarter", "month", "week"],
    getDate: (parsed) => {
      return dateFromIsoWeek(parsed[1], parsed[2], 1);
    },
  },
  "YYYY-WW-d": {
    match: /^ *[12]\d{3}[ \-]?[wW](0?[1-9]|[1-4]\d|5[0-3])(?:[ \-]?[1-7]) *$/,
    parse: /^ *(\d{4})[ \-]?[wW](0?[1-9]|[1-4]\d|5[0-3])(?:[ \-]?([1-7])) *$/,
    validIntervals: ["decade", "year", "quarter", "month", "week"],
    getDate: (parsed) => {
      return dateFromIsoWeek(parsed[1], parsed[2], parsed[3]);
    },
  },
  "MM/DD/YYYY": {
    match: /^ *(0?[1-9]|1[0-2])([\-\/] ?)(0?[1-9]|[1-2]\d|3[01])\2([12]\d{3})$/,
    parse: /^ *(0?[1-9]|1[0-2])([\-\/] ?)(0?[1-9]|[1-2]\d|3[01])\2(\d{4})$/,
    validIntervals: ["decade", "year", "quarter", "month", "week", "day"],
    getDate: (parsed) => {
      return new Date(parsed[4], parsed[1] - 1, parsed[3]);
    },
  },
  "DD/MM/YYYY": {
    match: /^ *(0?[1-9]|[1-2]\d|3[01])([\-\.\/ ?])(0?[1-9]|1[0-2])\2([12]\d{3})$/,
    parse: /^ *(0?[1-9]|[1-2]\d|3[01])([\-\.\/ ?])(0?[1-9]|1[0-2])\2(\d{4})$/,
    validIntervals: ["decade", "year", "quarter", "month", "week", "day"],
    getDate: (parsed) => {
      return new Date(parsed[4], parsed[3] - 1, parsed[1]);
    },
  },
  "YYYY-MM-DD": {
    match: /^ *([12]\d{3})([\-\/\. ?])(0?[1-9]|1[0-2])\2(0?[1-9]|[1-2]\d|3[01])$/,
    parse: /^ *(\d{4})([\-\/\. ?])(0?[1-9]|1[0-2])\2(0?[1-9]|[1-2]\d|3[01])$/,
    validIntervals: ["decade", "year", "quarter", "month", "week", "day"],
    getDate: (parsed) => {
      return new Date(parsed[1], parsed[3] - 1, parsed[4]);
    },
  },
  "MM/DD/YYYY HH:MM": {
    match: /^ *(0?[1-9]|1[0-2])([-\/] ?)(0?[1-9]|[1-2]\d|3[01])\2([12]\d{3}) *[ \-\|] *(0?\d|1\d|2[0-3]):([0-5]\d) *$/,
    parse: /^ *(0?[1-9]|1[0-2])([-\/] ?)(0?[1-9]|[1-2]\d|3[01])\2(\d{4}) *[ \-\|] *(0?\d|1\d|2[0-3]):([0-5]\d) *$/,
    validIntervals: [
      "decade",
      "year",
      "quarter",
      "month",
      "week",
      "day",
      "hour",
      "minute",
    ],
    getDate: (parsed) => {
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
    },
  },
  "DD.MM.YYYY HH:MM": {
    match: /^ *(0?[1-9]|[1-2]\d|3[01])([-\.\/ ?])(0?[1-9]|1[0-2])\2([12]\d{3}) *[ \-\|] *(0?\d|1\d|2[0-3]):([0-5]\d) *$/,
    parse: /^ *(0?[1-9]|[1-2]\d|3[01])([-\.\/ ?])(0?[1-9]|1[0-2])\2(\d{4}) *[ \-\|] *(0?\d|1\d|2[0-3]):([0-5]\d) *$/,
    validIntervals: [
      "decade",
      "year",
      "quarter",
      "month",
      "week",
      "day",
      "hour",
      "minute",
    ],
    getDate: (parsed) => {
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
    },
  },
  "YYYY-MM-DD HH:MM": {
    match: /^ *([12]\d{3})([-\/\. ?])(0?[1-9]|1[0-2])\2(0?[1-9]|[1-2]\d|3[01]) *[ \-\|] *(0?\d|1\d|2[0-3]):([0-5]\d) *$/,
    parse: /^ *(\d{4})([-\/\. ?])(0?[1-9]|1[0-2])\2(0?[1-9]|[1-2]\d|3[01]) *[ \-\|] *(0?\d|1\d|2[0-3]):([0-5]\d) *$/,
    validIntervals: [
      "decade",
      "year",
      "quarter",
      "month",
      "week",
      "day",
      "hour",
      "minute",
    ],
    getDate: (parsed) => {
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
    },
  },
  "MM/DD/YYYY HH:MM:SS": {
    match: /^ *(0?[1-9]|1[0-2])([-\/] ?)(0?[1-9]|[1-2]\d|3[01])\2([12]\d{3}) *[ \-\|] *(0?\d|1\d|2[0-3]):([0-5]\d)(?::([0-5]\d))? *$/,
    parse: /^ *(0?[1-9]|1[0-2])([-\/] ?)(0?[1-9]|[1-2]\d|3[01])\2(\d{4}) *[ \-\|] *(0?\d|1\d|2[0-3]):([0-5]\d)(?::([0-5]\d))? *$/,
    validIntervals: [
      "decade",
      "year",
      "quarter",
      "month",
      "week",
      "day",
      "hour",
      "minute",
      "second",
    ],
    getDate: (parsed) => {
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
    },
  },
  "DD.MM.YYYY HH:MM:SS": {
    match: /^ *(0?[1-9]|[1-2]\d|3[01])([-\.\/ ?])(0?[1-9]|1[0-2])\2([12]\d{3}) *[ \-\|] *(0?\d|1\d|2[0-3]):([0-5]\d)(?::([0-5]\d))? *$/,
    parse: /^ *(0?[1-9]|[1-2]\d|3[01])([-\.\/ ?])(0?[1-9]|1[0-2])\2(\d{4}) *[ \-\|] *(0?\d|1\d|2[0-3]):([0-5]\d)(?::([0-5]\d))? *$/,
    validIntervals: [
      "decade",
      "year",
      "quarter",
      "month",
      "week",
      "day",
      "hour",
      "minute",
      "second",
    ],
    getDate: (parsed) => {
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
    },
  },
  "YYYY-MM-DD HH:MM:SS": {
    match: /^ *([12]\d{3})([-\/\. ?])(0?[1-9]|1[0-2])\2(0?[1-9]|[1-2]\d|3[01]) *[ \-\|] *(0?\d|1\d|2[0-3]):([0-5]\d)(?::([0-5]\d))? *$/,
    parse: /^ *(\d{4})([-\/\. ?])(0?[1-9]|1[0-2])\2(0?[1-9]|[1-2]\d|3[01]) *[ \-\|] *(0?\d|1\d|2[0-3]):([0-5]\d)(?::([0-5]\d))? *$/,
    validIntervals: [
      "decade",
      "year",
      "quarter",
      "month",
      "week",
      "day",
      "hour",
      "minute",
      "second",
    ],
    getDate: (parsed) => {
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
    },
  },
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

function getPrognosisStartDate(data, prognosisStartIndex) {
  const format = getDateFormatForData(data);
  const cell = getFirstColumnSerie(data)[prognosisStartIndex];
  return format.getDate(cell.match(format.parse));
}

function getDataWithDateParsedAndSortedByDate(data) {
  const format = getDateFormatForData(data);
  return [
    data[0],
    ...data
      .slice(1) // exclude the header row from date parsing and sorting
      .map((row) => {
        return row.map((cell, cellIndex) => {
          if (cellIndex !== 0) {
            // only the first cell of every row should be parsed
            return cell;
          }
          if (cell.match) {
            // check if cell is actually a string that has .match function
            return format.getDate(cell.match(format.parse));
          }
          return cell;
        });
      })
      .sort((a, b) => {
        return a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0;
      }),
  ];
}

function getFirstAndLastDateFromData(data) {
  const parsedDatesData = getDataWithDateParsedAndSortedByDate(data);
  const dates = getFirstColumnSerie(parsedDatesData);
  const firstDate = dates.shift();
  const lastDate = dates.pop();
  return {
    first: firstDate,
    last: lastDate,
  };
}

function getIntervalForData(data) {
  const { first, last } = getFirstAndLastDateFromData(data);
  const diffSeconds = differenceInSeconds(last, first);

  // 30 years
  if (diffSeconds > 30 * 365 * 24 * 60 * 60) {
    return "decade";
  }
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

function formatDateForInterval(date, interval) {
  const intervalConfig = intervals[interval];
  if (intervalConfig.formatFunction instanceof Function) {
    return intervalConfig.formatFunction(date);
  } else if (intervalConfig.d3format) {
    const formatDate = d3TimeFormat.timeFormat(intervalConfig.d3format);
    return formatDate(date);
  }
  throw new Error(
    "formatDateForInterval failed, no formatFunction nor d3format found for interval"
  );
}

// intervals are used to set the tickCount and format the date on the X axis
// the user chooses a specific interval via an option
const intervals = {
  decade: {
    d3format: "%Y",
    vegaInterval: { interval: "year", step: 10 },
    label: "Dekaden",
    getFirstStepDateAfterDate: function (date) {
      const year = date.getFullYear();
      const firstOfJanuarySameYear = new Date(year, 0, 1);
      if (isBefore(firstOfJanuarySameYear, date)) {
        return new Date(year + 1, 0, 1);
      } else {
        return firstOfJanuarySameYear;
      }
    },
    getLastStepDateBeforeDate: function (date) {
      const year = date.getFullYear();
      const firstOfJanuarySameYear = new Date(year, 0, 1);
      if (isAfter(firstOfJanuarySameYear, date)) {
        return new Date(year - 1, 0, 1);
      } else {
        return firstOfJanuarySameYear;
      }
    },
  },
  year: {
    d3format: "%Y",
    vegaInterval: { interval: "year", step: 1 },
    label: "Jahre",
    getFirstStepDateAfterDate: function (date) {
      const year = date.getFullYear();
      const firstOfJanuarySameYear = new Date(year, 0, 1);
      if (isBefore(firstOfJanuarySameYear, date)) {
        return new Date(year + 1, 0, 1);
      } else {
        return firstOfJanuarySameYear;
      }
    },
    getLastStepDateBeforeDate: function (date) {
      const year = date.getFullYear();
      const firstOfJanuarySameYear = new Date(year, 0, 1);
      if (isAfter(firstOfJanuarySameYear, date)) {
        return new Date(year - 1, 0, 1);
      } else {
        return firstOfJanuarySameYear;
      }
    },
  },
  quarter: {
    // the formatFunction is only used for the legend for now
    // there is no easy way to teach the time formatter in vega about quarters
    formatFunction: (date) => {
      // there are cases where we do not get a date object here, but maybe a timestamp
      // in these cases we try to create a new date object from the value first
      if (!(date instanceof Date)) {
        date = new Date(date);
      }
      return (
        "Q" + Math.floor(date.getMonth() / 3 + 1) + " " + date.getFullYear()
      );
    },
    vegaInterval: { interval: "month", step: 3 },
    label: "Quartale",
    getFirstStepDateAfterDate: function (date) {
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
    getLastStepDateBeforeDate: function (date) {
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
    },
  },
  month: {
    d3format: "%b %Y",
    vegaInterval: { interval: "month", step: 1 },
    label: "Monate",
    getFirstStepDateAfterDate: function (date) {
      const year = date.getFullYear();
      const month = date.getMonth();
      const firstOfTheSameMonth = new Date(year, month, 1);
      if (isBefore(firstOfTheSameMonth, date)) {
        return new Date(year, month + 1, 1);
      } else {
        return firstOfTheSameMonth;
      }
    },
    getLastStepDateBeforeDate: function (date) {
      const year = date.getFullYear();
      const month = date.getMonth();
      const firstOfTheSameMonth = new Date(year, month, 1);
      if (isAfter(firstOfTheSameMonth, date)) {
        return new Date(year, month - 1, 1);
      } else {
        return firstOfTheSameMonth;
      }
    },
  },
  week: {
    formatFunction: (date) => {
      // instead of the data series, we need the actual tick values here to make this work
      const d = new Date(date);

      function includeYear() {
        // todo: we should find a way to get the actual ticks displayed to include the year only when it is actually different
        // from the label before. for now, we include the year for all labels because that is the least wrong
        return true;
      }
      if (includeYear()) {
        return `${getISOWeekYear(d)} W${getISOWeek(date)}`;
      } else {
        return `W${getISOWeek(date)}`;
      }
    },
    ticks: (data) => {
      // we can't use 'week' interval, because that is d3-time based, and d3-time thinks the week starts on a sunday
      // instead we implement a ticks function here returning every monday in the scale
      const { first, last } = getFirstAndLastDateFromData(data);
      const scale = d3Scale.scaleTime().domain([first, last]);
      const ticks = scale.ticks(d3Time.timeMonday.every(1));
      return ticks;
    },
    label: "Wochen",
    getFirstStepDateAfterDate: function (date) {
      const startOfThisWeek = startOfISOWeek(date);
      if (isBefore(startOfThisWeek, date)) {
        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDate();
        return startOfISOWeek(new Date(year, month, day + 7)); // this is not correct yet probably
      } else {
        return startOfThisWeek;
      }
    },
    getLastStepDateBeforeDate: function (date) {
      const startOfThisWeek = startOfISOWeek(date);
      if (isAfter(startOfThisWeek, date)) {
        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDate();
        return startOfISOWeek(new Date(year, month, day - 7)); // this is not correct yet probably
      } else {
        return startOfThisWeek;
      }
    },
  },
  day: {
    d3format: "%-d.\u2009%-m.\u2009%-Y",
    vegaInterval: { interval: "day", step: 1 },
    label: "Tage",
    getFirstStepDateAfterDate: function (date) {
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
    getLastStepDateBeforeDate: function (date) {
      const year = date.getFullYear();
      const month = date.getMonth();
      const day = date.getDate();
      const beginningOfTheSameDate = new Date(year, month, day, 0, 0, 0);
      if (isAfter(beginningOfTheSameDate, date)) {
        return new Date(year, month, day - 1);
      } else {
        return beginningOfTheSameDate;
      }
    },
  },
  hour: {
    d3format: "%-d.\u2009%-m. %H Uhr",
    vegaInterval: { interval: "hour", step: 1 },
    label: "Stunden",
    getFirstStepDateAfterDate: function (date) {
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
    getLastStepDateBeforeDate: function (date) {
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
    },
  },
  minute: {
    d3format: "%-d.\u2009%-m. %H:%M Uhr",
    vegaInterval: { interval: "hour", step: 1 },
    label: "Minuten",
    getFirstStepDateAfterDate: function (date) {
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
    getLastStepDateBeforeDate: function (date) {
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
    },
  },
  second: {
    d3format: "%-d.\u2009%-m. %H:%M:%S Uhr",
    vegaInterval: { interval: "hour", step: 1 },
    label: "Sekunden",
    getFirstStepDateAfterDate: function (date) {
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
    getLastStepDateBeforeDate: function (date) {
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
    },
  },
};

module.exports = {
  dateFormats,
  isDateSeries,
  isDateSeriesData,
  getFirstColumnSerie,
  getDateFormatForSerie,
  getDateFormatForValue,
  getDataWithDateParsedAndSortedByDate,
  getFirstAndLastDateFromData,
  getIntervalForData,
  getDateFormatForData,
  formatDateForInterval,
  getPrognosisStartDate,
  intervals,
};
