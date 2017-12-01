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

module.exports = {
  getDataWithStringsCastedToFloats: getDataWithStringsCastedToFloats
};
