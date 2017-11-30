function getDataWithStringsCastedToFloats(data) {
  return data
    .map(row => {
      return row
        .map(cell => {
          if (Number.isNaN(parseFloat(cell))) {
            return cell;
          } else {
            return parseFloat(cell);
          }
        })
    })
}

module.exports = {
  getDataWithStringsCastedToFloats: getDataWithStringsCastedToFloats
};
