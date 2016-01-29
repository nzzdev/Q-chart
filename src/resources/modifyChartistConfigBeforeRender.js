import {getFlatDatapoints} from './helpers';

Number.isInteger = Number.isInteger || function(value) {
  return typeof value === "number" && 
   isFinite(value) && 
   Math.floor(value) === value;
};

// ressource for setting bar width which corresponds to current SeriesBarDistance which corresponds to current number of bars
// last thing that happens before chart gets rendered
// this ressource needs ../plugins/chartist-plugin-fit-bars.js to work properly

export default function modifyChartistConfigBeforeRender(config, type, data, size, rect) {

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

  // add some padding to top of chart if needed for the label
  if (!config.horizontalBars) {
    config.chartPadding.top = 12;
  }

  // check if we have only integers as values (no floats), then use only integers for the axis labels
  try {
    let flatDatapoints = getFlatDatapoints(data);
    let onlyInteger = true;
    for (let value of flatDatapoints) {
      if (!Number.isInteger(parseFloat(value))) {
        onlyInteger = false;
      }
    }
    config.axisY.onlyInteger = onlyInteger;
  } catch (e) {
    // ignore errors;
  }
}
