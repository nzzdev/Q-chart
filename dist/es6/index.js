import 'paulirish/matchMedia.js';
import 'paulirish/matchMedia.js/matchMedia.addListener.js';

import 'core-js/es6/object';

import Chartist from 'chartist';
import {getConfig as getChartistConfig} from './resources/chartistConfig';
import SizeObserver from './resources/SizeObserver';
import {types as chartTypes} from './resources/types';
import {seriesTypes, getDigitLabelFontStyle} from './resources/seriesTypes';
import {getTextWidth} from './resources/helpers';
import modifyChartistConfigBeforeRender from './resources/modifyChartistConfigBeforeRender';
import setYAxisOffset from './resources/setYAxisOffset';

import rendererConfigDefaults from './rendererConfigDefaults';

import loadCSS from 'fg-loadcss';
import onloadCSS from 'fg-loadcss@0.2.4/onloadCSS';

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
      .map(serie => serie.data.slice(0))
  };
  return data;
}

function shortenNumberLabels(config, data) {
  if (!data.series.length || data.series[0].length === 0) {
    return 1;
  }
  let divisor = 1;
  let flatDatapoints = data.series
    .reduce((a, b) => a.concat(b))
    .filter(cell => !isNaN(parseFloat(cell)))
    .slice(0) // copy to not mess with original data by sorting
    .sort((a, b) => parseFloat(a) - parseFloat(b));

  let maxValue = flatDatapoints[flatDatapoints.length - 1];

  if (!maxValue) {
    return;
  }

  // use the max value to calculate the divisor
  if (maxValue >= Math.pow(10,9)) {
    divisor = Math.pow(10,9)
  } else if (maxValue >= Math.pow(10,6)) {
    divisor = Math.pow(10,6)
  } else if (maxValue >= Math.pow(10,4)) {
    divisor = Math.pow(10,3);
  }

  // the max label is the maxvalue rounded up, doesn't need to be perfectly valid, just stay on the save side regarding space
  let maxLabel = Math.ceil(maxValue / Math.pow(10,maxValue.length)) * Math.pow(10,maxValue.length);

  let axis = config.horizontalBars ? 'axisX' : 'axisY';

  if (axis === 'axisX') {
    config[axis].scaleMinSpace = getTextWidth(maxLabel/divisor, getDigitLabelFontStyle()) * 1.5;
  }
  config[axis].labelInterpolationFnc = (value, index) => {
    return value / divisor;
  }
  return divisor;
}

function modifyData(config, item, data, size, rect) {
  // if there are detected series types
  // we need to let them modify the data
  if (item.data.x && item.data.x.type) {
    if (seriesTypes.hasOwnProperty(item.data.x.type.id)) {
      
      if (seriesTypes[item.data.x.type.id].x.modifyData) {
        seriesTypes[item.data.x.type.id].x.modifyData(config, item.data.x.type, data, size, rect);
      }
      
      if (seriesTypes[item.data.x.type.id].x[size] && seriesTypes[item.data.x.type.id].x[size].modifyData) {
        seriesTypes[item.data.x.type.id].x[size].modifyData(config, item.data.x.type, data, size, rect);
      }

      if (seriesTypes[item.data.x.type.id].x[item.type] && seriesTypes[item.data.x.type.id].x[item.type].modifyData) {
        seriesTypes[item.data.x.type.id].x[item.type].modifyData(config, item.data.x.type, data, size, rect);
      }

      if (seriesTypes[item.data.x.type.id].x[size] && seriesTypes[item.data.x.type.id].x[size][item.type] && seriesTypes[item.data.x.type.id].x[size][item.type].modifyData) {
        seriesTypes[item.data.x.type.id].x[size][item.type].modifyData(config, item.data.x.type, data, size, rect);
      }
    }

    // let the chart type modify the config
    if (chartTypes[item.type].modifyData) {
      chartTypes[item.type].modifyData(config, data, size, rect);
    }
  }
}

function getCombinedChartistConfig(item, data, size, rect) {
  let config = Object.assign(getChartistConfig(item, size), item.chartConfig);

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

  // let the chart type modify the config
  if (chartTypes[item.type].modifyConfig) {
    chartTypes[item.type].modifyConfig(config, data, size, rect);
  }

  // if there are detected series types
  // we need to let them modify the config
  if (item.data.x && item.data.x.type) {
    if (seriesTypes.hasOwnProperty(item.data.x.type.id)) {
      
      if (seriesTypes[item.data.x.type.id].x.modifyConfig) {
        seriesTypes[item.data.x.type.id].x.modifyConfig(config, item.data.x.type, data, size, rect);
      }
      
      if (seriesTypes[item.data.x.type.id].x[size] && seriesTypes[item.data.x.type.id].x[size].modifyConfig) {
        seriesTypes[item.data.x.type.id].x[size].modifyConfig(config, item.data.x.type, data, size, rect);
      }

      if (seriesTypes[item.data.x.type.id].x[item.type] && seriesTypes[item.data.x.type.id].x[item.type].modifyConfig) {
        seriesTypes[item.data.x.type.id].x[item.type].modifyConfig(config, item.data.x.type, data, size, rect);
      }

      if (seriesTypes[item.data.x.type.id].x[size] && seriesTypes[item.data.x.type.id].x[size][item.type] && seriesTypes[item.data.x.type.id].x[size][item.type].modifyConfig) {
        seriesTypes[item.data.x.type.id].x[size][item.type].modifyConfig(config, item.data.x.type, data, size, rect);
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

function renderChartist(item, element, chartistConfig, dataForChartist) {
  return new Chartist[chartTypes[item.type].chartistType](element, dataForChartist, chartistConfig);
}

function getLegendHtml(item) {
  let html = `
    <div class="q-chart__legend">`;
  if (item.data && item.data.y && item.data.y.data && item.data.y.data.length && item.data.y.data.length > 1) {
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

export function getDivisorString(divisor) {
  let divisorString = '';
  switch (divisor) {
    case Math.pow(10,9):
      divisorString = ' (Mrd.)';
      break;
    case Math.pow(10,6):
      divisorString = ' (Mio.)';
      break;
    case Math.pow(10,3):
      divisorString = ' (Tsd.)';
      break;
    default:
      divisorString = '';
      break;
  }
  return divisorString;
}

function wrapEmojisInSpan(text) {
  text = text.replace(
    /([\ud800-\udbff])([\udc00-\udfff])/g,
    '<span class="emoji">$&</span>');
  return text;
}

function getContextHtml(item, chartistConfig) {
  let axisExplanation = {x: '', y: ''};
  axisExplanation.y = getDivisorString(chartistConfig.yValueDivisor);

  let html = `<h3 class="q-chart__title">${wrapEmojisInSpan(item.title)}</h3>`;
  html += getLegendHtml(item);
  if (!item.data.y) {
    item.data.y = {};
  }
  var axisNames = new Array('y', 'x');
  if (chartistConfig.horizontalBars) {
    axisNames.reverse();
  }
  
  html += `<div class="q-chart__label-y-axis">${item.data[axisNames[0]].label || ''}${axisExplanation[axisNames[0]]}</div>`;

  if (item.data.x && item.data.x.type && item.data.x.type.id === 'date') {
    html += '<div class="q-chart__chartist-container"></div>';
  } else {
    if (chartistConfig.horizontalBars) {
      html += `
        <div class="q-chart__label-x-axis">${item.data[axisNames[1]].label || ''}${axisExplanation[axisNames[1]]}</div>
        <div class="q-chart__chartist-container"></div>
      `;
    } else {
      html += `
        <div class="q-chart__chartist-container"></div>
        <div class="q-chart__label-x-axis">${item.data[axisNames[1]].label || ''}${axisExplanation[axisNames[1]]}</div>
      `;
    }
  }

  html += `  
    <div class="q-chart__footer">`;
  
  if (item.notes) {
    html += `<div class="q-chart__footer__notes">${item.notes}</div>`;
  }

  html += '<div class="q-chart__footer__sources">';
  if (item.sources && item.sources.length && item.sources.length > 0 && item.sources[0].text && item.sources[0].text.length > 0) {
    let sources = item.sources
      .filter(source => source.text && source.text.length > 0);

    html += `Quelle${sources.length > 1 ? 'n' : ''}: `;
    for (let source of sources) {
      if (source.href && source.href.length > 0 && source.validHref) {
        html += `<a href="${source.href}">${source.text}</a> `;
      } else {
        html += `${source.text}${sources.indexOf(source) !== sources.length -1 ? ', ' : ' '}`;
      }
    }
    
  } else {
    html += 'Quelle: nicht angegeben';
  }
  html += '</div></div>';
  return html;
}

function displayWithContext(item, element, chartistConfig, dataForChartist) {
  let el = document.createElement('section');
  el.setAttribute('class','q-chart');
  el.innerHTML = getContextHtml(item, chartistConfig);
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
  element.appendChild(el);
  return renderChartist(item, el.querySelector('.q-chart__chartist-container'), chartistConfig, dataForChartist);
}

function displayWithoutContext(item, element, chartistConfig, dataForChartist) {
  return renderChartist(item, element, chartistConfig, dataForChartist);
}

export function display(item, element, rendererConfig, withoutContext = false) {
  return new Promise((resolve, reject) => {
    try {
      if (!element) throw 'Element is not defined';
      if (!Chartist.hasOwnProperty(types[item.type].chartistType)) throw `Chartist Type (${types[item.type].chartistType}) not available`;

      if (!item.data || !item.data.x) {
        reject('no data');
        return;
      }

      if (rendererConfig && typeof rendererConfig === 'object') {
        rendererConfig = Object.assign({}, rendererConfigDefaults, rendererConfig);
      } else {
        rendererConfig = rendererConfigDefaults;
      }

      let themeUrl = rendererConfig.themeUrl || `${rendererConfig.rendererBaseUrl}themes/${rendererConfig.theme}`;
      let themeLoadCSS = loadCSS(`${themeUrl}/styles.css`);
      let themeLoadPromise = new Promise((resolve, reject) => {
        onloadCSS(themeLoadCSS, () => {
          resolve();
        });
      })

      let chart;

      sizeObserver.onResize((rect) => {
        // prepare data
        let dataForChartist = getChartDataForChartist(item);
        if (!dataForChartist || dataForChartist === null) {
          reject('data could not be prepared for chartist');
          return;
        }

        // prepare config and modify data if necessary based on config
        let drawSize = getElementSize(rect);
        let chartistConfig = getCombinedChartistConfig(item, dataForChartist, drawSize, rect);
        chartistConfig.yValueDivisor = shortenNumberLabels(chartistConfig, dataForChartist);
        setYAxisOffset(chartistConfig, item.type, dataForChartist);
        modifyData(chartistConfig, item, dataForChartist, drawSize, rect);

        try {
          if (withoutContext) {
            chart = displayWithoutContext(item, element, chartistConfig, dataForChartist);
          } else {
            chart = displayWithContext(item, element, chartistConfig, dataForChartist);
          }
        } catch (e) {
          reject(e);
        }
        
        // we do not want line breaking in labels and develop a consistent version
        // for all browsers, so we disable foreignObject here.
        chart.supportsForeignObject = false;

        if (chart && chart.on) {
          chart.on('created', () => {
            resolve(chart, [themeLoadPromise]);
          });
        } else {
          reject(chart);
        }
      }, element, true);

      // this is going crazy on nzz.ch with its floating ads
      // sizeObserver.onElementRectChange((rect) => {
      //   let drawSize = getElementSize(rect);
      //   if (withoutContext) {
      //     displayWithoutContext(item, element, drawSize, rect);
      //   } else {
      //     displayWithContext(item, element, drawSize, rect);
      //   }
      // }, element);

    } catch (e) {
      reject(e);
    } 
  });
}
