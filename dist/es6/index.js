// chartist needs this, which is a bit sad, as we don't really need the responsive options of chartist.
import 'paulirish/matchMedia.js';
import 'paulirish/matchMedia.js/matchMedia.addListener.js';

import 'core-js/es6/object';

import Chartist from 'chartist';
import {getConfig as getChartistConfig} from './resources/chartistConfig';
import SizeObserver from './resources/SizeObserver';
import {types as chartTypes} from './resources/types';
import {seriesTypes, getDigitLabelFontStyle} from './resources/seriesTypes';

import {getDateObject} from './resources/seriesTypes/dateSeriesType';
import {seriesTypeConfig} from './resources/seriesTypes/dateConfigPerInterval';

import {getTextWidth, getFlatDatapoints} from './resources/helpers';
import modifyChartistConfigBeforeRender from './resources/modifyChartistConfigBeforeRender';
import setYAxisOffset from './resources/setYAxisOffset';

import {vizColorClasses, brightVizColorClasses} from './resources/vizColors.js';

import rendererConfigDefaults from './rendererConfigDefaults';

import loadCSS from 'fg-loadcss';
import onloadCSS from './resources/onloadCSS';

export var types = chartTypes;

var sizeObserver = new SizeObserver();

var chars = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o'];

var stylesLoaded = false;

function getChartDataForChartist(item) {
  if (!item.data || !item.data.x || !item.data.y) return null;

  // we need to clone the arrays (with slice(0)) because chartist fumbles with the data
  let data = {
    labels: item.data.x.data.slice(0),
    series: item.data.y.data.slice(0)
      .map(serie => serie.data.slice(0))
  };
  return data;
}

function getExtent(data) {
  let flatDatapoints = getFlatDatapoints(data);
  if (flatDatapoints && flatDatapoints.length) {
    return [
      flatDatapoints[0],
      flatDatapoints[flatDatapoints.length - 1]
    ];
  }
  return null;
}

function getMinMaxAndDivisor(data) {
  let extent = getExtent(data);

  if (!extent) {
    return {
      min: null,
      max: null,
      divisor: 1
    };
  }

  let [minValue, maxValue] = getExtent(data);

  let divisor = Math.max(getDivisor(maxValue), getDivisor(Math.abs(minValue)));

  // the max label is the maxvalue rounded up, doesn't need to be perfectly valid, just stay on the save side regarding space
  let maxLabel = Math.ceil(maxValue / Math.pow(10,maxValue.length)) * Math.pow(10,maxValue.length);

  return {
    min: minValue,
    max: maxValue,
    divisor: divisor
  };
}

function shortenNumberLabels(config, data) {
  let { min: minValue, max: maxValue, divisor } = getMinMaxAndDivisor(data);

  let maxLabel = 1;

  if (maxValue) {
    // the max label is the maxvalue rounded up, doesn't need to be perfectly valid, just stay on the save side regarding space
    maxLabel = Math.ceil(maxValue / Math.pow(10, maxValue.length)) * Math.pow(10, maxValue.length);
  }

  let axis = config.horizontalBars ? 'axisX' : 'axisY';

  if (axis === 'axisX') {
    config[axis].scaleMinSpace = getTextWidth(maxLabel/divisor, getDigitLabelFontStyle()) * 1.5;
  }
  config[axis].labelInterpolationFnc = (value, index) => {
    // return value / divisor;
    // todo: once https://github.com/gionkunz/chartist-js/issues/771 is resolved, the rounding here can get removed again probably
    return Chartist.roundWithPrecision(value) / divisor;
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

  }
  // let the chart type modify the config
  if (chartTypes[item.type].modifyData) {
    chartTypes[item.type].modifyData(config, data, size, rect);
  }
}

function getCombinedChartistConfig(item, data, size, rect) {
  let config = Object.assign(getChartistConfig(item, size), item.chartConfig);

  for (let option of chartTypes[item.type].options) {
    switch (option.type) {
      case 'number':
      case 'oneOf':
      case 'boolean':
      case 'selection':
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
    chartTypes[item.type].modifyConfig(config, data, size, rect, item);
  }

  // if there are detected series types
  // we need to let them modify the config
  if (item.data.x && item.data.x.type) {
    if (seriesTypes.hasOwnProperty(item.data.x.type.id)) {

      if (seriesTypes[item.data.x.type.id].x.modifyConfig) {
        seriesTypes[item.data.x.type.id].x.modifyConfig(config, item.data.x.type, data, size, rect, item);
      }

      if (seriesTypes[item.data.x.type.id].x[size] && seriesTypes[item.data.x.type.id].x[size].modifyConfig) {
        seriesTypes[item.data.x.type.id].x[size].modifyConfig(config, item.data.x.type, data, size, rect, item);
      }

      if (seriesTypes[item.data.x.type.id].x[item.type] && seriesTypes[item.data.x.type.id].x[item.type].modifyConfig) {
        seriesTypes[item.data.x.type.id].x[item.type].modifyConfig(config, item.data.x.type, data, size, rect, item);
      }

      if (seriesTypes[item.data.x.type.id].x[size] && seriesTypes[item.data.x.type.id].x[size][item.type] && seriesTypes[item.data.x.type.id].x[size][item.type].modifyConfig) {
        seriesTypes[item.data.x.type.id].x[size][item.type].modifyConfig(config, item.data.x.type, data, size, rect, item);
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

export function getFormattedDate(date, format, interval){
  date = getDateObject( date, format);
  return seriesTypeConfig[interval].format(0, false, date, true);
}

function getLegendHtml(item) {
  
  let isDate = item.data.x.type && item.data.x.type.id === 'date';
  let hasPrognosis = isDate && item.data.x.type.options && !isNaN(item.data.x.type.options.prognosisStart);
  let svgBox = `
    <svg width="12" height="12">
      <line x1="1" y1="11" x2="11" y2="1" />
    </svg>`;
  let isLine = item.type === 'Line';
  let itemBox = isLine ? svgBox : '';
  let html = `
    <div class="q-chart__legend q-chart__legend--${item.type.toLowerCase()}">`;

  if (item.data && item.data.y && item.data.y.data && item.data.y.data.length && item.data.y.data.length > 1 ) {
    let highlightDataSeries = false;
    if (item.options && item.options.hasOwnProperty('highlightDataSeries')) {
      highlightDataSeries = item.options.highlightDataSeries;
    }
    let hasHighlighted = highlightDataSeries && !isNaN(highlightDataSeries);
    for (let i = 0; i < item.data.y.data.length; i++) {
      let serie = item.data.y.data[i];
      let isActive = hasHighlighted && highlightDataSeries === i;
      html += `
      <div class="q-chart__legend__item ${hasHighlighted ? brightVizColorClasses[i] : vizColorClasses[i]} q-chart__legend__item--${chars[i]} ${isActive ? vizColorClasses[i] : ''}">
        <div class="q-chart__legend__item__box q-chart__legend__item__box--${item.type.toLowerCase()}">${itemBox}</div>
        <div class="q-chart__legend__item__text s-font-note-s ${isActive && hasHighlighted ? '' : 's-font-note-s--light'}">${serie.label}</div>
      </div>`;
    }
  }

  if (hasPrognosis){
    let {prognosisStart,interval} = item.data.x.type.options;
    let date = getFormattedDate(item.data.x.data[prognosisStart], item.data.x.type.config.format, interval );
    html += `
      <div class="q-chart__legend__item q-chart__legend__item--prognosis">
        <div class="q-chart__legend__item__box s-color-gray-5 ${isLine ? 'q-chart__legend__item__box--line' : ''}">${itemBox}</div>
        <div class="q-chart__legend__item__text s-font-note-s s-font-note-s--light">Prognose (ab ${date})</div>
      </div>`;
  }

  html += `
    </div>
  `;
  return html;
}

export function getDivisor(maxValue) {
  let divisor = 1;
  if (!maxValue || maxValue === 0) {
    return divisor;
  }

  // use the max value to calculate the divisor
  if (maxValue >= Math.pow(10,9)) {
    divisor = Math.pow(10,9)
  } else if (maxValue >= Math.pow(10,6)) {
    divisor = Math.pow(10,6)
  } else if (maxValue >= Math.pow(10,4)) {
    divisor = Math.pow(10,3);
  }
  return divisor;
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

  let html = `<h3 class="s-q-item__title">${wrapEmojisInSpan(item.title)}</h3>`;
  html += getLegendHtml(item);
  if (!item.data.y) {
    item.data.y = {};
  }
  var axisNames = new Array('y', 'x');
  if (chartistConfig.horizontalBars) {
    axisNames.reverse();
  }

  html += `<div class="q-chart__label-y-axis s-font-note-s s-font-note-s--light">${item.data[axisNames[0]].label || ''}${axisExplanation[axisNames[0]]}</div>`;

  if (item.data.x && item.data.x.type && item.data.x.type.id === 'date') {
    if (chartistConfig.horizontalBars) {
      html += `<div class="q-chart__label-x-axis s-font-note-s s-font-note-s--light">${item.data[axisNames[1]].label || ''}${axisExplanation[axisNames[1]]}</div>`;
    }
    html += '<div class="q-chart__chartist-container"></div>';
  } else {
    if (chartistConfig.horizontalBars) {
      html += `
        <div class="q-chart__label-x-axis s-font-note-s s-font-note-s--light">${item.data[axisNames[1]].label || ''}${axisExplanation[axisNames[1]]}</div>
        <div class="q-chart__chartist-container"></div>
      `;
    } else {
      html += `
        <div class="q-chart__chartist-container"></div>
        <div class="q-chart__label-x-axis s-font-note-s s-font-note-s--light">${item.data[axisNames[1]].label || ''}${axisExplanation[axisNames[1]]}</div>
      `;
    }
  }

  html += `
    <div class="s-q-item__footer">`;

  if (item.notes) {
    html += `<div class="s-q-item__footer__notes">${item.notes}</div>`;
  }

  html += '<div class="s-q-item__footer__sources">';
  if (item.sources && item.sources.length && item.sources.length > 0 && item.sources[0].text && item.sources[0].text.length > 0) {
    let sources = item.sources
      .filter(source => source.text && source.text.length > 0);

    html += `Quelle${sources.length > 1 ? 'n' : ''}: `;
    for (let source of sources) {
      if (source.href && source.href.length > 0 && source.validHref) {
        html += `<a href="${source.href}" target="_blank">${source.text}</a>${sources.indexOf(source) !== sources.length -1 ? ', ' : ' '}`;
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
  el.setAttribute('class','q-chart s-q-item');
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

      let rendererPromises = [];

      if (rendererConfig.loadStyles && stylesLoaded === false) {
        let themeUrl = rendererConfig.themeUrl || `${rendererConfig.rendererBaseUrl}themes/${rendererConfig.theme}`;
        let themeLoadCSS = loadCSS(`${themeUrl}/styles.css`);
        let themeLoadPromise = new Promise((resolve, reject) => {
          onloadCSS(themeLoadCSS, () => {
            resolve();
          });
        });

        // additional styles
        let sophieStylesLoad = loadCSS('https://service.sophie.nzz.ch/bundle/sophie-q@~0.1.1,sophie-font@~0.2.0,sophie-color@~1.0.0,sophie-viz-color@~1.0.1[general].css');
        let sophieStylesLoadPromise = new Promise((resolve, reject) => {
          onloadCSS(sophieStylesLoad, () => {
            resolve();
          });
        });

        Promise.all([themeLoadPromise, sophieStylesLoadPromise])
          .then(styles => {
            stylesLoaded = true;
          })

        rendererPromises.push(themeLoadPromise);
        rendererPromises.push(sophieStylesLoadPromise);
      }

      let chart;

      let lastWidth;

      sizeObserver.onResize((rect) => {

        if (rect.width && lastWidth === rect.width) {
          return;
        }

        lastWidth = rect.width;

        // prepare data
        let dataForChartist = getChartDataForChartist(item);
        if (!dataForChartist || dataForChartist === null) {
          reject('data could not be prepared for chartist');
          return;
        }

        // prepare config and modify data if necessary based on config
        let drawSize = getElementSize(rect);
        let chartistConfig = getCombinedChartistConfig(item, dataForChartist, drawSize, rect);
        
        shortenNumberLabels(chartistConfig, dataForChartist);
        
        let { divisor } = getMinMaxAndDivisor(dataForChartist);
        chartistConfig.yValueDivisor = divisor;

        modifyData(chartistConfig, item, dataForChartist, drawSize, rect);

        // set Y axis offset after we have modified the data (date series label formatting)
        setYAxisOffset(chartistConfig, item.type, dataForChartist);

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
            resolve({
              graphic: chart,
              promises: rendererPromises
            });
          });
        } else {
          reject(chart);
        }
      }, element, true);

    } catch (e) {
      reject(e);
    }
  });
}
