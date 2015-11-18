import Chartist from 'chartist';
import './styles.css!'

function getChartDataForChartist(data) {
  let dataForChart = {
    labels: data.x.data,
    series: data.series.map(serie => serie.data)
  }
  return dataForChart;
}

export function display(item, element) {
  if (!Chartist.hasOwnProperty(item.chartType)) throw `chartType (${item.chartType}) not available`;
  return new Chartist[item.chartType](element, getChartDataForChartist(item.data), item.chartConfig);
}
