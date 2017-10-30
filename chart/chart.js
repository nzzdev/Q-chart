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

export var types = chartTypes;

var sizeObserver = new SizeObserver();

var chars = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o'];

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
  if (item.dataSeriesType) {
    if (seriesTypes.hasOwnProperty(item.dataSeriesType.id)) {

      if (seriesTypes[item.dataSeriesType.id].x.modifyData) {
        seriesTypes[item.dataSeriesType.id].x.modifyData(config, item.dataSeriesType, data, size, rect);
      }

      if (seriesTypes[item.dataSeriesType.id].x[size] && seriesTypes[item.dataSeriesType.id].x[size].modifyData) {
        seriesTypes[item.dataSeriesType.id].x[size].modifyData(config, item.dataSeriesType, data, size, rect);
      }

      if (seriesTypes[item.dataSeriesType.id].x[item.type] && seriesTypes[item.dataSeriesType.id].x[item.type].modifyData) {
        seriesTypes[item.dataSeriesType.id].x[item.type].modifyData(config, item.dataSeriesType, data, size, rect);
      }

      if (seriesTypes[item.dataSeriesType.id].x[size] && seriesTypes[item.dataSeriesType.id].x[size][item.type] && seriesTypes[item.dataSeriesType.id].x[size][item.type].modifyData) {
        seriesTypes[item.dataSeriesType.id].x[size][item.type].modifyData(config, item.dataSeriesType, data, size, rect);
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

  chartTypes[item.type].options.forEach(option => {
    if (item.options && typeof item.options[option.name] !== undefined) {
      option.modifyConfig(config, item.options[option.name], data, size, rect);
    } else {
      option.modifyConfig(config, option.defaultValue, data, size, rect);
    }
  });

  // let the chart type modify the config
  if (chartTypes[item.type].modifyConfig) {
    chartTypes[item.type].modifyConfig(config, data, size, rect, item);
  }

  // if there are detected series types
  // we need to let them modify the config
  if (item.dataSeriesType) {
    if (seriesTypes.hasOwnProperty(item.dataSeriesType.id)) {

      if (seriesTypes[item.dataSeriesType.id].x.modifyConfig) {
        seriesTypes[item.dataSeriesType.id].x.modifyConfig(config, item.dataSeriesType, data, size, rect, item);
      }

      if (seriesTypes[item.dataSeriesType.id].x[size] && seriesTypes[item.dataSeriesType.id].x[size].modifyConfig) {
        seriesTypes[item.dataSeriesType.id].x[size].modifyConfig(config, item.dataSeriesType, data, size, rect, item);
      }

      if (seriesTypes[item.dataSeriesType.id].x[item.type] && seriesTypes[item.dataSeriesType.id].x[item.type].modifyConfig) {
        seriesTypes[item.dataSeriesType.id].x[item.type].modifyConfig(config, item.dataSeriesType, data, size, rect, item);
      }

      if (seriesTypes[item.dataSeriesType.id].x[size] && seriesTypes[item.dataSeriesType.id].x[size][item.type] && seriesTypes[item.dataSeriesType.id].x[size][item.type].modifyConfig) {
        seriesTypes[item.dataSeriesType.id].x[size][item.type].modifyConfig(config, item.dataSeriesType, data, size, rect, item);
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

export function getLegendHtml(item) {
  let isDate = item.dataSeriesType && item.dataSeriesType.id === 'date';
  let hasPrognosis = isDate && item.dataSeriesType.options && !isNaN(item.dataSeriesType.options.prognosisStart);
  let svgBox = `
    <svg width="12" height="12">
      <line x1="1" y1="11" x2="11" y2="1" />
    </svg>`;
  let isLine = item.type === 'Line';
  let itemBox = isLine ? svgBox : '';
  let html = `
    <div class="q-chart__legend q-chart__legend--${item.type.toLowerCase()}">`;

  if (item.seriesLabels.length > 1) {
    let highlightDataSeries;
    if (item.options && item.options.hasOwnProperty('highlightDataSeries') && item.options.highlightDataSeries !== null && item.options.highlightDataSeries !== undefined) {
      highlightDataSeries = parseInt(item.options.highlightDataSeries, 10);
    }

    let hasHighlighted = highlightDataSeries !== undefined && highlightDataSeries !== null;
    for (let i = 0; i < item.seriesLabels.length; i++) {

      let colorClass = vizColorClasses[i];
      let fontClasses = 's-font-note-s';
      if (hasHighlighted && highlightDataSeries !== i) {
        colorClass = brightVizColorClasses[i];
        fontClasses += ' s-font-note-s--light';
      }

      // handle color overwrite
      let styleAttribute = '';
      if (item.options.hasOwnProperty('colorOverwrite') && item.options.colorOverwrite.length && item.options.colorOverwrite.length > 0) {
        item.options.colorOverwrite.forEach(colorOverwrite => {
          if (i === colorOverwrite.position - 1) { // -1 because colorOverwrite.position is 1 based not 0 based
            if (hasHighlighted && highlightDataSeries !== i) {
              styleAttribute = ` style="color: ${colorOverwrite.colorBright};"`
            } else {
              styleAttribute = ` style="color: ${colorOverwrite.color};"`
            }
          }
        })
      }

      html += `
      <div class="q-chart__legend__item ${colorClass} q-chart__legend__item--${chars[i]}"${styleAttribute}>
        <div class="q-chart__legend__item__box q-chart__legend__item__box--${item.type.toLowerCase()}">${itemBox}</div>
        <div class="q-chart__legend__item__text ${fontClasses}">${item.seriesLabels[i]}</div>
      </div>`;
    }
  }

  if (hasPrognosis){
    let {prognosisStart, interval} = item.dataSeriesType.options;
    let date = getFormattedDate(item.data.labels[prognosisStart], item.dataSeriesType.config.format, interval );
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
      divisorString = 'Mrd.';
      break;
    case Math.pow(10,6):
      divisorString = 'Mio.';
      break;
    case Math.pow(10,3):
      divisorString = 'Tsd.';
      break;
    default:
      divisorString = '';
      break;
  }
  return divisorString;
}

function getContextHtml(item, chartistConfig) {
  let html = getLegendHtml(item);


  let chartistContainerMarkup = '<div class="q-chart__chartist-container"></div>';

  if (chartistConfig.horizontalBars) {
    if (!item.options.hideAxisLabel) {
      html += `<div class="q-chart__label-y-axis s-font-note-s s-font-note-s--light">${item.xAxisLabel || ''}</div>`;  
    }
    html += chartistContainerMarkup;
  } else {
    html += chartistContainerMarkup;
    if (!item.options.hideAxisLabel) {
      html += `<div class="q-chart__label-x-axis s-font-note-s s-font-note-s--light">${item.xAxisLabel || ''}</div>`;
    }
  }
  html += '</div>';
  return html;
}

function displayWithContext(item, element, chartistConfig, dataForChartist) {
  let el = document.createElement('section');
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

      if (rendererConfig && typeof rendererConfig === 'object') {
        rendererConfig = Object.assign({}, rendererConfigDefaults, rendererConfig);
      } else {
        rendererConfig = rendererConfigDefaults;
      }

      let rendererPromises = [];

      let chart;

      let lastWidth;

      sizeObserver.onResize((rect) => {

        if (rect.width && lastWidth === rect.width) {
          return;
        }

        lastWidth = rect.width;

        // copy to not mess with original data
        const data = JSON.parse(JSON.stringify(item.data));

        // prepare config and modify data if necessary based on config
        let drawSize = getElementSize(rect);
        let chartistConfig = getCombinedChartistConfig(item, data, drawSize, rect);

        shortenNumberLabels(chartistConfig, data);

        let { divisor } = getMinMaxAndDivisor(data);
        chartistConfig.yValueDivisor = divisor;

        modifyData(chartistConfig, item, data, drawSize, rect);

        // set Y axis offset after we have modified the data (date series label formatting)
        setYAxisOffset(chartistConfig, item.type, data);

        try {
          if (withoutContext) {
            chart = displayWithoutContext(item, element, chartistConfig, data);
          } else {
            chart = displayWithContext(item, element, chartistConfig, data);
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
