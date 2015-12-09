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
    //console.log(noOfBars);

    // set seriesBarDistance and corresponding bar width

    var theBarWidth = 10;
    var theSeriesBarDistance = 11; 

    if (noOfBars <= 8){
      theBarWidth = 28;
      theSeriesBarDistance = 29; 
    }
    else if (noOfBars > 8 && noOfBars <= 16){
      theBarWidth = 20;
      theSeriesBarDistance = 21; 
    } 
    else if (noOfBars > 16 && noOfBars <= 24){
      theBarWidth = 14;
      theSeriesBarDistance = 15; 
    } 
    else {
      theBarWidth = 10;
      theSeriesBarDistance = 11; 
    }

    // add calcBarWidth object + value to config - this will be used in chartist-plugin-fit-bars.js to set the width of bars 
    config.barWidth = theBarWidth;

    // set seriesBarDistance
    config.seriesBarDistance = theSeriesBarDistance;

  }
}
