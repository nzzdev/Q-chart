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

function getDateFormatForSerie(serie) {
  const detectedTypeFormatsCount = {};

  for (let datapoint of serie) {
    let dateFormat = getDateFormatForValue(datapoint);
    // if we have a date format, count the occurences of each detected format
    if (!detectedTypeFormatsCount.hasOwnProperty(dateFormat)) {
      detectedTypeFormatsCount[dateFormat] = 0;
    }
    detectedTypeFormatsCount[dateFormat] = detectedTypeFormatsCount[dateFormat] + 1;
  }

  // sort based on counts
  const sortedFormats = Object.keys(detectedTypeFormatsCount)
    .sort((a, b) => {
      return detectedTypeFormatsCount[b] - detectedTypeFormatsCount[a];
    })

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

function getFirstColumnSerie(data) {
  return array2d.transpose(data)
    .shift() // get the first column
    .slice(1) // get everything but the first cell
}

module.exports = {
  isDateSeries: isDateSeries,
  getFirstColumnSerie: getFirstColumnSerie,
  getDateFormatForSerie: getDateFormatForSerie,
  getDateFormatForValue: getDateFormatForValue
}