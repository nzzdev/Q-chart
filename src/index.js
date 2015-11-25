import Chartist from 'chartist';
import getChartistConfig from './resources/chartistConfig';
import SizeObserver from './resources/SizeObserver';

import './styles.css!'

var sizeObserver = new SizeObserver();
var dataStore = {};

function getChartDataForChartist(item) {
  if (!dataStore[item._id]) {
    dataStore[item._id] = {
      labels: item.data.x.data,
      series: item.data.series.map(serie => serie.data)
    }
  }
  return dataStore[item._id];
}

function getCombinedChartistConfig(chartConfig, chartType, size, data) {
  return Object.assign(getChartistConfig(chartType.toLowerCase(), size, data), chartConfig);
}

function getElementSize(rect) {
  let size = 'small';
  if (rect.width && rect.width > 480) {
    size = 'large';
  } else {
    size = 'small';
  }
  return size;
}

function renderChartist(item, element, drawSize) {
  let data = getChartDataForChartist(item);
  let config = getCombinedChartistConfig(item.chartConfig, item.chartType, drawSize, data);
  new Chartist[item.chartType](element, data, config);
}

function getLegendHtml(item) {
  return `
    <div class="q-chart__legend">
      <div class="q-chart__legend__item">
        <div class="q-chart__legend__item__box"></div>
        <div class="q-chart__legend__item__text">Legend</div>
      </div>
    </div>
  `;
}

function getContextHtml(item) {
  let html = `
    <h2 class="q-chart__title">${item.title}</h2>`;
  html += getLegendHtml(item);
  if (!item.data.y) {
    item.data.y = {};
  }
  // if (!item.data.y.label) {
  //   item.data.y.label = '';
  // }
  html += `
    <div class="q-chart__label-y-axis">${item.data.y.label || ''}</div>
    <div class="q-chart__chartist-container"></div>
    <div class="q-chart__label-x-axis">${item.data.x.label}</div>
    <div class="q-chart__notes"></div>
  `
  return html;
}

function displayWithContext(item, element, drawSize) {
  let el = document.createElement('section');
  el.setAttribute('class','q-chart');
  el.innerHTML = getContextHtml(item);
  element.appendChild(el);
  renderChartist(item, el.querySelector('.q-chart__chartist-container'), drawSize);
}

function displayWithoutContext(item, element, drawSize) {
  renderChartist(item, element, drawSize);
}

var cancelResize;
var drawSize;

export function display(item, element, withoutContext = false) {
  if (!Chartist.hasOwnProperty(item.chartType)) throw `chartType (${item.chartType}) not available`;

  drawSize = getElementSize(element.getBoundingClientRect());

  if (withoutContext) {
    displayWithoutContext(item, element, drawSize);
  } else {
    displayWithContext(item, element, drawSize);
  }

  if (cancelResize) {
    cancelResize();
  }

  cancelResize = sizeObserver.onResize((rect) => {
    let newSize = getElementSize(rect);
    if (drawSize !== newSize) {
      drawSize = newSize;
      if (withoutContext) {
        displayWithoutContext(item, element, drawSize);
      } else {
        displayWithContext(item, element, drawSize);
      }
    }
  }, element);

  return true;
}
