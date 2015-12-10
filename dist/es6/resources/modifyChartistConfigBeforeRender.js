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

  if (type === 'Bar' && size === 'large') {

    var noOfBars = data.labels.length * data.series.length;

    // set seriesBarDistance and corresponding bar width
    var barWidth = 10;
    var seriesBarDistance = 11; 
    
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

  if (config.horizontalBars) {
    let maxLength = 0;
    for (let i = 0; i < data.labels.length; i++) {
      
      if (data.currentLabels && data.currentLabels[i]) {
        if (data.currentLabels[i].length > maxLength) {
          maxLength = data.currentLabels[i].length;
        }
      } else {
        if (data.labels[i].length > maxLength) {
          maxLength = data.labels[i].length;
        }
      }
    }
    config.axisY.offset = maxLength * 8;
  }
}
