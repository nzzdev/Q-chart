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

  if ((type === 'Bar' || type === 'StackedBar') && size === 'large') {

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

  let maxLength = 0;
  let isNumber = false;
  if ((type === 'Bar' || type === 'StackedBar') && config.horizontalBars) {
    for (let i = 0; i < data.labels.length; i++) {
      let length = 0;
      if (data.currentLabels && data.currentLabels[i]) {
        if (Number.isInteger(data.currentLabels[i])) {
          isNumber = true;
          length = Math.floor(data.currentLabels[i]).toString().length;
        } else {
          length = data.currentLabels[i].length;
        }
      } else {
        if (Number.isInteger(data.labels[i])) {
          isNumber = true;
          length = Math.floor(data.labels[i]).toString().length;
        } else {
          length = data.labels[i].length;
        }
      }
      if (length > maxLength) {
        maxLength = length;
      }
    }
  } else {
    data.series.map(serie => {
      serie.map(datapoint => {
        let length = 0;
        if (Number.isInteger(datapoint)) {
          isNumber = true;
          length = Math.floor(datapoint).toString().length;
        } else {
          length = datapoint.length;
        }
        if (length > maxLength) {
          maxLength = length;
        }
      })
    })
  }
  let averageCharLength = isNumber ? 10 : 9;
  let offset = maxLength * averageCharLength;
  if (offset < 25) {
    offset = 25;
  }
  config.axisY.offset = offset;
}
