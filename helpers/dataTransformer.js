const array2d = require('array2d');

function arrayToChartistModel(data) {
  array2d.eachCell(data, (val, x, y) => {
    if (!isNaN(parseFloat(val))) {
      data[x][y] = parseFloat(data[x][y]);
    }
  })
  let a = data.slice(0, 1);
  data = array2d.transpose(data.slice(1));
  return {
    labels: data[0],
    series: data.slice(1)
  }
}

module.exports = {
  arrayToChartistModel: arrayToChartistModel
}