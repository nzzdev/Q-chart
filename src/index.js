import Chartist from 'chartist';
import getChartistConfig from './resources/chartistConfig';
import SizeObserver from './resources/SizeObserver';
import {types as chartTypes} from './resources/types';

import './styles.css!'

export var types = chartTypes;

var sizeObserver = new SizeObserver();
var dataStore = {};

var chars = ['a','b','c','d','e','f'];

function getChartDataForChartist(item) {
  return {
    labels: item.data.x.data,
    series: item.data.y.data.map(serie => serie.data)
  };
}

function getCombinedChartistConfig(item, size, data) {
  let config = Object.assign(getChartistConfig(item.type, size, data), item.chartConfig);
  if (item.options) {
    for (let option of chartTypes[item.type].options) {
      switch (option.type) {
        case 'oneOf':
          if (typeof item.options[option.name] !== undefined) {
            option.modifyConfig(config, item.options[option.name], size);
          }
          break;
      }
    }
  }
  return config;
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
  let config = getCombinedChartistConfig(item, drawSize, data);
  new Chartist[chartTypes[item.type].chartistType](element, data, config);
}

function getLegendHtml(item) {
  let html = `
    <div class="q-chart__legend">`;

  for (var i in item.data.y.data) {
    let serie = item.data.y.data[i];
    html += `
      <div class="q-chart__legend__item q-chart__legend__item--${chars[i]}">
        <div class="q-chart__legend__item__box"></div>
        <div class="q-chart__legend__item__text">${serie.label}</div>
      </div>`;
  }
  html += `
    </div>
  `;
  return html;
}

function getContextHtml(item) {
  let html = `
    <h3 class="q-chart__title">${item.title}</h3>`;
  html += getLegendHtml(item);
  if (!item.data.y) {
    item.data.y = {};
  }
  html += `
    <div class="q-chart__label-y-axis">${item.data.y.label || ''}</div>
    <div class="q-chart__chartist-container"></div>
    <div class="q-chart__label-x-axis">${item.data.x.label}</div>
    <div class="q-chart__footer">
      <div class="q-chart__footer__notes">${item.notes}</div>
      <div class="q-chart__footer__sources"></div>
    </div>
  `
  return html;
}

function displayWithContext(item, element, drawSize) {
  let el = document.createElement('section');
  el.setAttribute('class','q-chart');
  el.innerHTML = getContextHtml(item);
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
  element.appendChild(el);
  renderChartist(item, el.querySelector('.q-chart__chartist-container'), drawSize);
}

function displayWithoutContext(item, element, drawSize) {
  renderChartist(item, element, drawSize);
}

var cancelResize;
var drawSize;

export function display(item, element, withoutContext = false) {
  if (!element) throw 'Element is not defined';

  if (!Chartist.hasOwnProperty(types[item.type].chartistType)) throw `Chartist Type (${types[item.type].chartistType}) not available`;

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
