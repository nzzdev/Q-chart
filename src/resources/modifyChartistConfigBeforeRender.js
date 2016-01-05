import {getTextWidth} from './helpers';
import {getLabelFontStyle, getDigitLabelFontStyle} from './seriesTypes';

Number.isInteger = Number.isInteger || function(value) {
  return typeof value === "number" && 
   isFinite(value) && 
   Math.floor(value) === value;
};

// ressource for setting bar width which corresponds to current SeriesBarDistance which corresponds to current number of bars
// last thing that happens before chart gets rendered
// this ressource needs ../plugins/chartist-plugin-fit-bars.js to work properly

export function modifyChartistConfigBeforeRender(config, type, data, size, rect) {

  // config is the chartist config
  // type is the chart type
  // data is the data as passed to chartist
  // size is either small or large
  // rect is the boundingClientRect of the chart container element

  // do any hacks with chartist config here.

  if ((type === 'Bar' || type === 'StackedBar') && size === 'large' && config.horizontalBars === false) {

    let noOfBars;
    if (type === 'Bar') {
      noOfBars = data.labels.length * data.series.length;
    } else {
      noOfBars = data.labels.length;
    }

    // set seriesBarDistance and corresponding bar width
    let barWidth = 10;
    let seriesBarDistance = 11; 
    
    if (noOfBars <= 4){
      barWidth = 36;
      seriesBarDistance = 37; 
    }
    else if (noOfBars > 4 && noOfBars <= 8){
      barWidth = 28;
      seriesBarDistance = 29; 
    }
    else if (noOfBars > 8 && noOfBars <= 16){
      barWidth = 20;
      seriesBarDistance = 21; 
    } 
    else if (noOfBars > 16 && noOfBars <= 24){
      barWidth = 14;
      seriesBarDistance = 15; 
    } 
    else {
      barWidth = 10;
      seriesBarDistance = 11; 
    }

    // add calcBarWidth object + value to config - this will be used in chartist-plugin-fit-bars.js to set the width of bars 
    config.barWidth = barWidth;

    // set seriesBarDistance
    config.seriesBarDistance = seriesBarDistance;
  }


  // Calculate the X Axis offset dependending on label length
  // this is not very accurate, as we don't really know what labels chartist is going to produce
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
            possibleLabel = parseFloat(datapoint).toFixed(1);
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
