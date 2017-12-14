const dateSeries = require('./dateSeries.js');
const d3timeFormat = require('d3-time-format');

function getLegendModel(item, colorScheme, vizColor) {
  const legendModel = {};

  legendModel.type = item.options.chartType.toLowerCase();
  legendModel.series = item.data[0].slice(1)
    .map((label, index) => {
      return {
        label: label,
        color: colorScheme.default[index]
      } 
    });

  // compile colors
  // let highlightDataSeries;
  // if (item.options && item.options.hasOwnProperty('highlightDataSeries') && item.options.highlightDataSeries !== null && item.options.highlightDataSeries !== undefined) {
  //   highlightDataSeries = parseInt(item.options.highlightDataSeries, 10);
  // }
  // if (highlightDataSeries) {

  // }


  // prognosis
  const hasPrognosis = item.options.dateSeriesOptions && item.options.dateSeriesOptions.prognosisStart && !isNaN(item.options.dateSeriesOptions.prognosisStart);
  if (hasPrognosis) {
    const {prognosisStart, interval} = item.options.dateSeriesOptions;

    const dataWithDateParsed = dateSeries.getDataWithDateParsed(item.data);
    const prognosisStartDate = dataWithDateParsed.slice(1)[prognosisStart];
    const intervalConfig = dateSeries.intervals[interval];

    d3timeFormat.timeFormatDefaultLocale(dateSeries.d3timeFormatLocale);
    const formatDate = d3timeFormat.timeFormat(intervalConfig.d3format);

    let legendLabel = 'Prognose ';
    if (prognosisStart !== dataWithDateParsed.slice(1).length + 1) { // if the prognosis is not the last label
      legendLabel += '(ab ';
    } else {
      legendLabel += '(';
    }
    legendLabel += `${formatDate(prognosisStartDate[0])})`

    legendModel.series.push({
      isPrognosis: true,
      label: legendLabel
    });
  }
  return legendModel;
}

module.exports = {
  getLegendModel: getLegendModel
}