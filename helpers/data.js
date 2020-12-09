const clone = require("clone");
const array2d = require("array2d");
const dateSeries = require("./dateSeries.js");

function getDataWithStringsCastedToFloats(data) {
  return data.map((row, i) => {
    if (i === 0) {
      // the first row is just the header
      return row;
    }
    return row.map((cell, ii) => {
      if (ii === 0) {
        // the first cell is the x axis and should not get casted
        return cell;
      }
      if (typeof cell !== "string") {
        return cell;
      }
      // if we do not have a valid floating point number format in the cell, return it's original value
      if (cell.match(/^[+-]?\d+(\.\d+)?$/) === null) {
        return cell;
      } else {
        // parseFloat the cell to have a Number instead of a String in the data
        return parseFloat(cell);
      }
    });
  });
}

function getWithOnlyStringsInFirstColumn(data) {
  return data.map(row => {
    if (row[0] === null || row[0] === undefined) {
      row[0] = "";
    }
    return row;
  });
}

function getLongestDataLabel(mappingData, transposed = false) {
  const item = mappingData.item;
  data = clone(item.data);
  if (transposed) {
    data = array2d.transpose(data);
  }
  const titleRow = data[0];
  titleRow.shift();
  return titleRow
    .map(label => {
      if (!mappingData.dateFormat) {
        return label;
      }

      return dateSeries.formatDateForInterval(
        label,
        item.options.dateSeriesOptions.interval
      );
    })
    .reduce((prev, current) => {
      if (prev.length > current.length) {
        return prev;
      }
      return current;
    }, "");
}

function getDivisorString(divisor) {
  let divisorString = "";
  switch (divisor) {
    case Math.pow(10, 9):
      divisorString = "Milliarden";
      break;
    case Math.pow(10, 6):
      divisorString = "Millionen";
      break;
    case Math.pow(10, 3):
      divisorString = "Tausend";
      break;
    default:
      divisorString = "";
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
  if (value >= Math.pow(10, 9)) {
    divisor = Math.pow(10, 9);
  } else if (value >= Math.pow(10, 6)) {
    divisor = Math.pow(10, 6);
  } else if (value >= Math.pow(10, 4)) {
    divisor = Math.pow(10, 3);
  }
  return divisor;
}

function getFlatData(data) {
  const dataOnly = array2d.crop(
    clone(data),
    1,
    1,
    array2d.width(data) - 1,
    array2d.height(data) - 1
  );
  const flatData = array2d.flatten(dataOnly);
  return flatData;
}

function getMaxValue(data) {
  const flatData = getFlatData(data).filter(value => {
    return value !== null && value !== undefined;
  });
  return Math.max.apply(null, flatData);
}

function getMinValue(data) {
  const flatData = getFlatData(data).filter(value => {
    return value !== null && value !== undefined;
  });
  return Math.min.apply(null, flatData);
}

function hasManualDivisor(largeNumbers) {
  return largeNumbers && largeNumbers.divideBy !== 0;
}

function getDivisor(data, largeNumbers) {
  if (hasManualDivisor(largeNumbers)) {
    return largeNumbers.divideBy;
  }
  try {
    const minValue = getMinValue(data);
    const maxValue = getMaxValue(data);
    return Math.max(
      getDivisorForValue(maxValue),
      getDivisorForValue(Math.abs(minValue))
    );
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
  hasManualDivisor: hasManualDivisor,
  getDivisor: getDivisor,
  getWithOnlyStringsInFirstColumn: getWithOnlyStringsInFirstColumn
};
