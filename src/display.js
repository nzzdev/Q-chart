import Chartist from 'chartist';
import * as chartistConfig from './chartistConfig';
import './styles.css!'

function getChartDataForChartist(data) {
  let dataForChart = {
    labels: data.x.data,
    series: data.series.map(serie => serie.data)
  }
  return dataForChart;
}

function getCombinedChartistConfig(chartConfig, chartType) {
  return Object.assign(chartistConfig[chartType.toLowerCase()], chartConfig);
}

export function display(item, element) {
  if (!Chartist.hasOwnProperty(item.chartType)) throw `chartType (${item.chartType}) not available`;
  return new Chartist[item.chartType](element, getChartDataForChartist(item.data), getCombinedChartistConfig(item.chartConfig, item.chartType));
}
