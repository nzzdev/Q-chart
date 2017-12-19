const clone = require('clone');
const array2d = require('array2d');

function getDataWithStringsCastedToFloats(data) {
  return data
    .map(row => {
      return row
        .map(cell => {
          if (cell === null) {
            return null;
          }
          // if we do not have a valid floating point number format in the cell, return it's original value
          if (cell.match(/^[+-]?\d+(\.\d+)?$/) === null) {
            return cell;
          } else {
            // parseFloat the cell to have a Number instead of a String in the data
            return parseFloat(cell);
          }
        })
    })
}

function getLongestDataLabel(data, transposed = false) {
  data = clone(data);
  if (transposed) {
    data = array2d.transpose(data);
  }
  const titleRow = data[0];
  titleRow.shift();
  return titleRow
    .reduce((prev, current) => {
      if (prev.length > current.length) {
        return prev;
      }
      return current;
    }, '')
}

function getDivisorString(divisor) {
  let divisorString = '';
  switch (divisor) {
    case Math.pow(10,9):
      divisorString = 'Milliarden';
      break;
    case Math.pow(10,6):
      divisorString = 'Millionen';
      break;
    case Math.pow(10,3):
      divisorString = 'Tausend';
      break;
    default:
      divisorString = '';
      break;
  }
  return divisorString;
}

function getDivisorForValue(value) {
  let divisor = 1;
  if (!value || value === 0) {
    return divisor;
  }

  // use the max value to calculate the divisor
  if (value >= Math.pow(10,9)) {
    divisor = Math.pow(10,9)
  } else if (value >= Math.pow(10,6)) {
    divisor = Math.pow(10,6)
  } else if (value >= Math.pow(10,4)) {
    divisor = Math.pow(10,3);
  }
  return divisor;
}

function getFlatData(data) {
  const dataOnly = array2d.crop(clone(data), 1, 1, array2d.width(data) - 1, array2d.height(data) - 1);
  const flatData = array2d.flatten(dataOnly);
  return flatData;
}


function getMaxValue(data) {
  const flatData = getFlatData(data);
  return Math.max.apply(null, flatData);
}

function getMinValue(data) {
  const flatData = getFlatData(data);
  return Math.min.apply(null, flatData);
}

function getDivisor(data) {
  try {
    const minValue = getMinValue(data);
    const maxValue = getMaxValue(data);
    return Math.max(getDivisorForValue(maxValue), getDivisorForValue(Math.abs(minValue)));
  } catch (err) {
    // if something goes wrong, the divisor is just 1
    return 1;
  }
}

module.exports = {
  getDataWithStringsCastedToFloats: getDataWithStringsCastedToFloats,  
  getLongestDataLabel: getLongestDataLabel,
  getDivisorString: getDivisorString,
  getDivisorForValue: getDivisorForValue,
  getFlatData: getFlatData,
  getMaxValue: getMaxValue,
  getMinValue: getMinValue,
  getDivisor: getDivisor
};
