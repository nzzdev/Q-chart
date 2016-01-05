import {getLabelFontStyle, getDigitLabelFontStyle} from './seriesTypes';
import {getTextWidth} from './helpers';

// Calculate the X Axis offset dependending on label length
// this is not very accurate, as we don't really know what labels chartist is going to produce
export default function setYAxisOffset(config, type, data) {
  let maxLabelWidth = 0;
  if ((type === 'Bar' || type === 'StackedBar') && config.horizontalBars) {
    maxLabelWidth = data.labels
      .reduce((maxWidth, label) => {
        let width = getTextWidth(label, getLabelFontStyle());
        if (maxWidth < width) {
          return width;
        }
        return maxWidth;
      },0);
  } else if (type === 'StackedBar') {
    let sums = [];
    for (let i = 0; i < data.series[0].length; i++) {
      if (!sums[i]) {
        sums[i] = 0;
      }
      for (let ii = 0; ii < data.series.length; ii++) {
        sums[i] = sums[i] + parseFloat(data.series[ii][i]);
      }
    }
    maxLabelWidth = sums
      .reduce((maxWidth, label) => {
        let width = getTextWidth(Math.round(label * 10)/10, getDigitLabelFontStyle());
        if (maxWidth < width) {
          return width;
        }
        return maxWidth;
      },0);
  } else {
    maxLabelWidth = data.series
      .reduce((overallMaxWidth, serie) => {
        let serieMaxWidth = serie.reduce((maxWidth, datapoint) => {
          let possibleLabel = datapoint;
          if (!isNaN(parseFloat(datapoint))) {
            possibleLabel = parseFloat(datapoint/config.yValueDivisor).toFixed(1);
          }
          
          let width = getTextWidth(possibleLabel, getDigitLabelFontStyle());
          if (maxWidth < width) {
            return width;
          }
          return maxWidth;
        },0);
        if (overallMaxWidth < serieMaxWidth) {
          return serieMaxWidth;
        }
        return overallMaxWidth;
      },0);
  }

  let offset = Math.ceil(maxLabelWidth + 5);
  if (offset < 30) {
    offset = 30;
  }

  config.axisY.offset = offset;
}
