import Chartist from 'chartist';
import {getConfig as getChartistConfig} from './resources/chartistConfig';
import SizeObserver from './resources/SizeObserver';
import {types as chartTypes} from './resources/types';
import {seriesTypes} from './resources/seriesTypes';
import {modifyChartistConfigBeforeRender} from './resources/modifyChartistConfigBeforeRender';

import './styles.css!'

export var types = chartTypes;

var sizeObserver = new SizeObserver();

var chars = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o'];

function getChartDataForChartist(item) {
  if (!item.data || !item.data.x || !item.data.y) return null;
  return {
    labels: item.data.x.data,
    series: item.data.y.data.map(serie => serie.data)
  };
}

function getCombinedChartistConfig(item, data, size, rect) {
  let config = Object.assign(getChartistConfig(item.type, size, data), item.chartConfig);


  for (let option of chartTypes[item.type].options) {
    switch (option.type) {
      case 'oneOf':
      case 'boolean':
        if (item.options && typeof item.options[option.name] !== undefined) {
          option.modifyConfig(config, item.options[option.name], data, size, rect);
        } else {
          option.modifyConfig(config, option.defaultValue, data, size, rect);
        }
        break;
    }
  }

  // if there are detected series types
  // we need to let them modify the config
  if (item.data.x && item.data.x.type) {
    if (seriesTypes.hasOwnProperty(item.data.x.type.id)) {
      seriesTypes[item.data.x.type.id].x.modifyConfig(config, item.data.x.type.options, data, size, rect);
    }
  }

  modifyChartistConfigBeforeRender(config, item.type, data, size, rect);

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

function renderChartist(item, element, drawSize, rect) {
  let data = getChartDataForChartist(item);
  if (data && data !== null) {
    let config = getCombinedChartistConfig(item, data, drawSize, rect);
    new Chartist[chartTypes[item.type].chartistType](element, data, config);
  }
}

function getLegendHtml(item) {
  let html = `
    <div class="q-chart__legend">`;
  if (item.data && item.data.y && item.data.y.data) {
    for (var i in item.data.y.data) {
      let serie = item.data.y.data[i];
      html += `
        <div class="q-chart__legend__item q-chart__legend__item--${chars[i]}">
          <div class="q-chart__legend__item__box"></div>
          <div class="q-chart__legend__item__text">${serie.label}</div>
        </div>`;
    }
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
    <div class="q-chart__label-x-axis">${item.data.x.label || ''}</div>
    <div class="q-chart__footer">
      <div class="q-chart__footer__notes">${item.notes}</div>
      <div class="q-chart__footer__sources"></div>
    </div>
  `
  return html;
}

function displayWithContext(item, element, drawSize, rect) {
  let el = document.createElement('section');
  el.setAttribute('class','q-chart');
  el.innerHTML = getContextHtml(item);
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
  element.appendChild(el);
  renderChartist(item, el.querySelector('.q-chart__chartist-container'), drawSize, rect);
}

function displayWithoutContext(item, element, drawSize, rect) {
  renderChartist(item, element, drawSize, rect);
}

export function display(item, element, withoutContext = false) {

  if (!element) throw 'Element is not defined';
  if (!Chartist.hasOwnProperty(types[item.type].chartistType)) throw `Chartist Type (${types[item.type].chartistType}) not available`;

  if (!item.data || !item.data.x) {
    return false;
  }

  sizeObserver.onResize((rect) => {
    let drawSize = getElementSize(rect);
    if (withoutContext) {
      displayWithoutContext(item, element, drawSize, rect);
    } else {
      displayWithContext(item, element, drawSize, rect);
    }
  }, element, true);

  return true;
}
