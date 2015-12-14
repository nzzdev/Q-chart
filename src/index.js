import 'core-js/es6/object';

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

  // we need to clone the arrays (with slice(0)) because chartist fumbles with the data
  // if reverseData is true, which we need for horizontal bars
  let data = {
    labels: item.data.x.data.slice(0),
    series: item.data.y.data.slice(0)
      .filter(serie => serie.data.slice(0))
      .map(serie => serie.data.slice(0))
  };
  return data;
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

  // if the chart type wants to modify the config
  if (chartTypes[item.type].modifyConfig) {
    chartTypes[item.type].modifyConfig(config, data, size, rect);
  }

  // if there are detected series types
  // we need to let them modify the data
  if (item.data.x && item.data.x.type) {
    if (seriesTypes.hasOwnProperty(item.data.x.type.id)) {
      
      if (seriesTypes[item.data.x.type.id].x.modifyConfig) {
        seriesTypes[item.data.x.type.id].x.modifyData(config, item.data.x.type.options, data, size, rect);
      }
      
      if (seriesTypes[item.data.x.type.id].x[size] && seriesTypes[item.data.x.type.id].x[size].modifyData) {
        seriesTypes[item.data.x.type.id].x[size].modifyData(config, item.data.x.type.options, data, size, rect);
      }

      if (seriesTypes[item.data.x.type.id].x[item.type] && seriesTypes[item.data.x.type.id].x[item.type].modifyData) {
        seriesTypes[item.data.x.type.id].x[item.type].modifyData(config, item.data.x.type.options, data, size, rect);
      }

      if (seriesTypes[item.data.x.type.id].x[size] && seriesTypes[item.data.x.type.id].x[size][item.type] && seriesTypes[item.data.x.type.id].x[size][item.type].modifyData) {
        seriesTypes[item.data.x.type.id].x[size][item.type].modifyData(config, item.data.x.type.options, data, size, rect);
      }
    
    }
  }

  // if there are detected series types
  // we need to let them modify the config
  if (item.data.x && item.data.x.type) {
    if (seriesTypes.hasOwnProperty(item.data.x.type.id)) {
      
      if (seriesTypes[item.data.x.type.id].x.modifyConfig) {
        seriesTypes[item.data.x.type.id].x.modifyConfig(config, item.data.x.type.options, data, size, rect);
      }
      
      if (seriesTypes[item.data.x.type.id].x[size] && seriesTypes[item.data.x.type.id].x[size].modifyConfig) {
        seriesTypes[item.data.x.type.id].x[size].modifyConfig(config, item.data.x.type.options, data, size, rect);
      }

      if (seriesTypes[item.data.x.type.id].x[item.type] && seriesTypes[item.data.x.type.id].x[item.type].modifyConfig) {
        seriesTypes[item.data.x.type.id].x[item.type].modifyConfig(config, item.data.x.type.options, data, size, rect);
      }

      if (seriesTypes[item.data.x.type.id].x[size] && seriesTypes[item.data.x.type.id].x[size][item.type] && seriesTypes[item.data.x.type.id].x[size][item.type].modifyConfig) {
        seriesTypes[item.data.x.type.id].x[size][item.type].modifyConfig(config, item.data.x.type.options, data, size, rect);
      }
    
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
    return new Chartist[chartTypes[item.type].chartistType](element, data, config);
  }
  return undefined;
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
    <div class="q-chart__footer">`;
  if (item.notes) {
    html += `<div class="q-chart__footer__notes">${item.notes}</div>`;
  }
  if (item.sources && item.sources.length && item.sources.length > 0 && item.sources[0].text.length > 0) {
    let sources = item.sources
      .filter(source => source.text && source.text.length > 0);

    html += `<div class="q-chart__footer__sources">Quelle${sources.length > 1 ? 'n' : ''}: `;
    for (let source of sources) {
      if (source.href && source.href.length > 0 && source.validHref) {
        html += `<a href="${source.href}">${source.text}</a> `;
      } else {
        html += `${source.text} `;
      }
    }
    html += '</div>';
  }
  html += '</div>';
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
  return renderChartist(item, el.querySelector('.q-chart__chartist-container'), drawSize, rect);
}

function displayWithoutContext(item, element, drawSize, rect) {
  return renderChartist(item, element, drawSize, rect);
}

export function display(item, element, withoutContext = false) {
  return new Promise((resolve, reject) => {
    try {
      if (!element) throw 'Element is not defined';
      if (!Chartist.hasOwnProperty(types[item.type].chartistType)) throw `Chartist Type (${types[item.type].chartistType}) not available`;

      if (!item.data || !item.data.x) {
        reject('no data');
      }

      sizeObserver.onResize((rect) => {
        let drawSize = getElementSize(rect);
        let chart;
        if (withoutContext) {
          chart = displayWithoutContext(item, element, drawSize, rect);
        } else {
          chart = displayWithContext(item, element, drawSize, rect);
        }
        if (chart && chart.on) {
          chart.on('created', () => {
            resolve(chart);
          });
        } else {
          reject(chart);
        }
      }, element, true);

      sizeObserver.onElementRectChange((rect) => {
        let drawSize = getElementSize(rect);
        if (withoutContext) {
          displayWithoutContext(item, element, drawSize, rect);
        } else {
          displayWithContext(item, element, drawSize, rect);
        }
      }, element);

    } catch (e) {
      reject(e);
    } 
  });
}
