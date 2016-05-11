import {seriesTypeConfig} from './dateConfigPerInterval';
import {isThereEnoughSpace} from './helpers';

// thanks datawrapper.de

function dateFromIsoWeek(year, week, day) {
  var d = new Date(Date.UTC(year, 0, 3));
  d.setUTCDate(3 - d.getUTCDay() + (week-1)*7 + parseInt(day,10));
  return d;
}

export function getDateObject(dateString, format) {
  if (format === 'Date') {
    return new Date(dateString);
  } else {
    let parsed = dateString.match(dateFormats[format].parse);
    switch (format) {
      case 'YYYY': return new Date(parsed[1], 0, 1);
      case 'YYYY-H': return new Date(parsed[1], (parsed[2]-1) * 6, 1);
      case 'H-YYYY': return new Date(parsed[2], (parsed[1]-1) * 6, 1);
      case 'YYYY-Q': return new Date(parsed[1], (parsed[2]-1) * 3, 1);
      case 'Q-YYYY': return new Date(parsed[2], (parsed[1]-1) * 3, 1);
      case 'YYYY-M': return new Date(parsed[1], (parsed[2]-1), 1);
      case 'M-YYYY': return new Date(parsed[2], (parsed[1]-1), 1);
      case 'YYYY-WW': return dateFromIsoWeek(parsed[1], parsed[2], 1);
      case 'YYYY-WW-d': return dateFromIsoWeek(parsed[1], parsed[2], parsed[3]);
      case 'YYYY-MM-DD': return new Date(parsed[1], (parsed[3]-1), parsed[4]);
      case 'DD/MM/YYYY': return new Date(parsed[4], (parsed[3]-1), parsed[1]);
      case 'MM/DD/YYYY': return new Date(parsed[4], (parsed[1]-1), parsed[3]);
      case 'YYYY-MM-DD HH:MM': return new Date(parsed[1], (parsed[3]-1), parsed[4], parsed[5] || 0, parsed[6] || 0, 0);
      case 'DD.MM.YYYY HH:MM': return new Date(parsed[4], (parsed[3]-1), parsed[1], parsed[5] || 0, parsed[6] || 0, 0);
      case 'MM/DD/YYYY HH:MM': return new Date(parsed[4], (parsed[1]-1), parsed[3], parsed[5] || 0, parsed[6] || 0, 0);
      case 'YYYY-MM-DD HH:MM:SS': return new Date(parsed[1], (parsed[3]-1), parsed[4], parsed[5] || 0, parsed[6] || 0, parsed[7] || 0);
      case 'DD.MM.YYYY HH:MM:SS': return new Date(parsed[4], (parsed[3]-1), parsed[1], parsed[5] || 0, parsed[6] || 0, parsed[7] || 0);
      case 'MM/DD/YYYY HH:MM:SS': return new Date(parsed[4], (parsed[1]-1), parsed[3], parsed[5] || 0, parsed[6] || 0, parsed[7] || 0);
    }
  }
}

// filters the labels and only shows the ones at the given interval in type.options
function getLabelsToDisplay(type, data) {
  let labelsToDisplay = [];
  let lastLabel; // do not repeat label, so we store the last generated label in this var
  data.labels.map((label, index) => {
    let formattedLabel = label;
    if (seriesTypeConfig[type.options.interval]
        && seriesTypeConfig[type.options.interval].format
        && type.config && type.config.format) {
      let date = getDateObject(label.toString(), type.config.format);
      formattedLabel = seriesTypeConfig[type.options.interval].format(index, data.labels.length, date, true);
    }
    if (formattedLabel !== lastLabel) {
      lastLabel = formattedLabel;
      labelsToDisplay[index] = formattedLabel;
    }
  })
  return labelsToDisplay;
}

function isLastVisibleLabel(labelsToDisplay, labelIndex) {
  return (labelsToDisplay.length - 1 === labelIndex);
}

// it is inefficient to format the labels again here, we already did that to measure the needed space.
// todo: improve that
export function setLabelsBasedOnIntervalAndAvailableSpace(config, type, data, size, rect, fontstyle) {
  let labelsToDisplay = getLabelsToDisplay(type, data);

  config.axisX = config.axisX || {};

  if (isThereEnoughSpace(labelsToDisplay, rect, config, fontstyle)) {
    data.labels.map((label, index) => {
      if (labelsToDisplay[index]) {
        data.labels[index] = seriesTypeConfig[type.options.interval].format(index, isLastVisibleLabel(labelsToDisplay, index), getDateObject(label.toString(), type.config.format));
      } else {
        data.labels[index] = ''; // do not show a gridline
      }
    });
  } else {
    data.labels.map((label, index) => {
      if (labelsToDisplay[index]) {
        if (seriesTypeConfig[type.options.interval]
            && seriesTypeConfig[type.options.interval].getForceShow
            && seriesTypeConfig[type.options.interval].getForceShow(index, isLastVisibleLabel(labelsToDisplay, index), data, config, size)) {
          data.labels[index] = seriesTypeConfig[type.options.interval].format(index, isLastVisibleLabel(labelsToDisplay, index), getDateObject(label.toString(), type.config.format));
        } else {
          data.labels[index] = ' '; // return false/empty string to make chartist not render a gridline here.
        }
      } else {
        data.labels[index] = ''; // do not show a gridline
      }
    });
  }
}

export function setLabelsBasedOnInterval(config, type, data, size, rect) {
  let labelsToDisplay = getLabelsToDisplay(type, data);

  data.labels.map((label, index) => {
    if (type.config && type.config.format) {
      let date = getDateObject(label.toString(), type.config.format);
      data.labels[index] = seriesTypeConfig[type.options.interval].format(index, isLastVisibleLabel(labelsToDisplay, index), date, true);
    } else {
      data.labels[index] = label;
    }
  });
}

// thanks datawrapper.de for the format regexes
// https://github.com/datawrapper/datawrapper/blob/9ddb90af4aab4b071b6cba195532edea0527b3be/dw.js/src/dw.column.types.js
var dateFormats = {
  // each format has two regex, a strict one for testing and a lazy one for parsing
  'YYYY': {
      parse: /^ *(\d{4}) *$/,
      precision: 'year'
  },
  'YYYY-H': {
      parse: /^ *(\d{4})[ \-\/]?[hH]([12]) *$/,
      precision: 'half'
  },
  'H-YYYY': {
      parse: /^ *[hH]([12])[ \-\/](\d{4}) *$/,
      precision: 'half'
  },
  'YYYY-Q': {
      parse: /^ *(\d{4})[ \-\/]?[qQ]([1234]) *$/,
      precision: 'quarter'
  },
  'Q-YYYY': {
      parse: /^ *[qQ]([1234])[ \-\/](\d{4}) *$/,
      precision: 'quarter'
  },
  'YYYY-M': {
      parse: /^ *(\d{4}) ?[ \-\/\.mM](0?[1-9]|1[0-2]) *$/,
      precision: 'month'
  },
  'M-YYYY': {
      parse: /^ *(0?[1-9]|1[0-2]) ?[ \-\/\.](\d{4}) *$/,
      precision: 'month'
  },
  'YYYY-WW': {
      parse: /^ *(\d{4})[ -]?[wW](0?[1-9]|[1-4]\d|5[0-3]) *$/,
      precision: 'week'
  },
  'MM/DD/YYYY': {
      parse: /^ *(0?[1-9]|1[0-2])([\-\/] ?)(0?[1-9]|[1-2]\d|3[01])\2(\d{4})$/,
      precision: 'day'
  },
  'DD/MM/YYYY': {
      parse: /^ *(0?[1-9]|[1-2]\d|3[01])([\-\.\/ ?])(0?[1-9]|1[0-2])\2(\d{4})$/,
      precision: 'day'
  },
  'YYYY-MM-DD': {
      parse: /^ *(\d{4})([\-\/\. ?])(0?[1-9]|1[0-2])\2(0?[1-9]|[1-2]\d|3[01])$/,
      precision: 'day'
  },
  'YYYY-WW-d': { // year + ISO week + [day]
      parse: /^ *(\d{4})[ \-]?[wW](0?[1-9]|[1-4]\d|5[0-3])(?:[ \-]?([1-7])) *$/,
      precision: 'day'
  },
  // dates with a time
  'MM/DD/YYYY HH:MM': {
      parse: /^ *(0?[1-9]|1[0-2])([-\/] ?)(0?[1-9]|[1-2]\d|3[01])\2(\d{4}) *[ \-\|] *(0?\d|1\d|2[0-3]):([0-5]\d) *$/,
      precision: 'day-minutes'
  },
  'DD.MM.YYYY HH:MM': {
      parse: /^ *(0?[1-9]|[1-2]\d|3[01])([-\.\/ ?])(0?[1-9]|1[0-2])\2(\d{4}) *[ \-\|] *(0?\d|1\d|2[0-3]):([0-5]\d) *$/,
      precision: 'day-minutes'
  },
  'YYYY-MM-DD HH:MM': {
      parse: /^ *(\d{4})([-\/\. ?])(0?[1-9]|1[0-2])\2(0?[1-9]|[1-2]\d|3[01]) *[ \-\|] *(0?\d|1\d|2[0-3]):([0-5]\d) *$/,
      precision: 'day-minutes'
  },
  // dates with a time
  'MM/DD/YYYY HH:MM:SS': {
      parse: /^ *(0?[1-9]|1[0-2])([-\/] ?)(0?[1-9]|[1-2]\d|3[01])\2(\d{4}) *[ \-\|] *(0?\d|1\d|2[0-3]):([0-5]\d)(?::([0-5]\d))? *$/,
      precision: 'day-seconds'
  },
  'DD.MM.YYYY HH:MM:SS': {
      parse: /^ *(0?[1-9]|[1-2]\d|3[01])([-\.\/ ?])(0?[1-9]|1[0-2])\2(\d{4}) *[ \-\|] *(0?\d|1\d|2[0-3]):([0-5]\d)(?::([0-5]\d))? *$/,
      precision: 'day-seconds'
  },
  'YYYY-MM-DD HH:MM:SS': {
      parse: /^ *(\d{4})([-\/\. ?])(0?[1-9]|1[0-2])\2(0?[1-9]|[1-2]\d|3[01]) *[ \-\|] *(0?\d|1\d|2[0-3]):([0-5]\d)(?::([0-5]\d))? *$/,
      precision: 'day-seconds'
  }
}
