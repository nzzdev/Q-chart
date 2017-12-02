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

module.exports = {
  getDataWithStringsCastedToFloats: getDataWithStringsCastedToFloats,  
  getLongestDataLabel: getLongestDataLabel
};
