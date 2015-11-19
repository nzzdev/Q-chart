import Chartist from 'chartist';
import getChartistConfig from './resources/chartistConfig';
import SizeObserver from './resources/SizeObserver';

import './styles.css!'

var sizeObserver = new SizeObserver();

function getChartDataForChartist(data) {
  let dataForChart = {
    labels: data.x.data,
    series: data.series.map(serie => serie.data)
  }
  return dataForChart;
}

function getCombinedChartistConfig(chartConfig, chartType, size, data) {
  return Object.assign(getChartistConfig(chartType.toLowerCase(), size, data), chartConfig);
}

function getElementSize(element) {
  let size = 'small';
  if (element.getBoundingClientRect) {
    let rect = element.getBoundingClientRect();
    if (rect.width && rect.width > 480) {
      size = 'large';
    } else {
      size = 'small';
    }
  }
  return size;
}

var cancelResize;
var drawSize;

export function display(item, element) {
  if (!Chartist.hasOwnProperty(item.chartType)) throw `chartType (${item.chartType}) not available`;

  let data = getChartDataForChartist(item.data);
  drawSize = getElementSize(element);

  new Chartist[item.chartType](element, data, getCombinedChartistConfig(item.chartConfig, item.chartType, drawSize, data));

  if (cancelResize) {
    cancelResize();
  }
  cancelResize = sizeObserver.onResize(() => {
    let newSize = getElementSize(element);
    if (drawSize !== newSize) {
      drawSize = newSize;
      new Chartist[item.chartType](element, data, getCombinedChartistConfig(item.chartConfig, item.chartType, drawSize, data));
    }
  })
  return true;
}
