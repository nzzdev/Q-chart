const array2d = require('array2d');

// thanks datawrapper.de for the format regexes
// https://github.com/datawrapper/datawrapper/blob/9ddb90af4aab4b071b6cba195532edea0527b3be/dw.js/src/dw.column.types.js
var dateFormats = {
  'YYYY': /^ *(?:1[0-9]|2[0-9])\d{2} *$/,
  'YYYY-H': /^ *[12]\d{3}[ \-\/]?[hH][12] *$/,
  'H-YYYY': /^ *[hH][12][ \-\/][12]\d{3} *$/,
  'YYYY-Q': /^ *[12]\d{3}[ \-\/]?[qQ][1234] *$/,
  'Q-YYYY': /^ *[qQ]([1234])[ \-\/][12]\d{3} *$/,
  'YYYY-M': /^ *([12]\d{3}) ?[ \-\/\.mM](0?[1-9]|1[0-2]) *$/,
  'M-YYYY': /^ *(0?[1-9]|1[0-2]) ?[ \-\/\.][12]\d{3} *$/,
  'YYYY-WW': /^ *[12]\d{3}[ -]?[wW](0?[1-9]|[1-4]\d|5[0-3]) *$/,
  'MM/DD/YYYY': /^ *(0?[1-9]|1[0-2])([\-\/] ?)(0?[1-9]|[1-2]\d|3[01])\2([12]\d{3})$/,
  'DD/MM/YYYY': /^ *(0?[1-9]|[1-2]\d|3[01])([\-\.\/ ?])(0?[1-9]|1[0-2])\2([12]\d{3})$/,
  'YYYY-MM-DD': /^ *([12]\d{3})([\-\/\. ?])(0?[1-9]|1[0-2])\2(0?[1-9]|[1-2]\d|3[01])$/,
  'YYYY-WW-d': /^ *[12]\d{3}[ \-]?[wW](0?[1-9]|[1-4]\d|5[0-3])(?:[ \-]?[1-7]) *$/,
  'MM/DD/YYYY HH:MM': /^ *(0?[1-9]|1[0-2])([-\/] ?)(0?[1-9]|[1-2]\d|3[01])\2([12]\d{3}) *[ \-\|] *(0?\d|1\d|2[0-3]):([0-5]\d) *$/,
  'DD.MM.YYYY HH:MM': /^ *(0?[1-9]|[1-2]\d|3[01])([-\.\/ ?])(0?[1-9]|1[0-2])\2([12]\d{3}) *[ \-\|] *(0?\d|1\d|2[0-3]):([0-5]\d) *$/,
  'YYYY-MM-DD HH:MM': /^ *([12]\d{3})([-\/\. ?])(0?[1-9]|1[0-2])\2(0?[1-9]|[1-2]\d|3[01]) *[ \-\|] *(0?\d|1\d|2[0-3]):([0-5]\d) *$/,
  'MM/DD/YYYY HH:MM:SS': /^ *(0?[1-9]|1[0-2])([-\/] ?)(0?[1-9]|[1-2]\d|3[01])\2([12]\d{3}) *[ \-\|] *(0?\d|1\d|2[0-3]):([0-5]\d)(?::([0-5]\d))? *$/,
  'DD.MM.YYYY HH:MM:SS': /^ *(0?[1-9]|[1-2]\d|3[01])([-\.\/ ?])(0?[1-9]|1[0-2])\2([12]\d{3}) *[ \-\|] *(0?\d|1\d|2[0-3]):([0-5]\d)(?::([0-5]\d))? *$/,
  'YYYY-MM-DD HH:MM:SS': /^ *([12]\d{3})([-\/\. ?])(0?[1-9]|1[0-2])\2(0?[1-9]|[1-2]\d|3[01]) *[ \-\|] *(0?\d|1\d|2[0-3]):([0-5]\d)(?::([0-5]\d))? *$/,
}

function getDateFormatForValue(value) {
  for (let format in dateFormats) {
    if (dateFormats[format].test(value)) {
      return format;
    }
  }
  return undefined;
}

function getFirstFormat(serie) {
  return getDateFormatForValue(serie[0]);
}

function isDateSeries(serie) {
  const uniqueDetectedTypeFormats = [];
  let dateFormat = null;
  for (let datapoint of serie) {
    let dateFormat = getDateFormatForValue(datapoint);
    if (dateFormat) {
      if (uniqueDetectedTypeFormats.indexOf(dateFormat) === -1) {
        uniqueDetectedTypeFormats.push(dateFormat);
      }
    } else { // if any of the datapoints is not a detected date we return false immediately
      return false;
    }
  }

  // check if all the formats of the detected date are the same
  // if not, we return false as we cannot handle different formats of dates for now
  if (uniqueDetectedTypeFormats.length > 1) {
    return false;
  }

  // we have detected exactly one unique date format
  if (uniqueDetectedTypeFormats.length === 1) {
    return true;
  }

  // default
  return false;
}

function getFirstColumnSerie(data) {
  return array2d.transpose(data)
    .shift() // get the first column
    .slice(1) // get everything but the first cell
}

module.exports = {
  isDateSeries: isDateSeries,
  getFirstColumnSerie: getFirstColumnSerie,
  getFirstFormat: getFirstFormat,
  getDateFormatForValue: getDateFormatForValue
}