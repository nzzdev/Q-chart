import {vertBarHeight, vertBarSetPadding, chartHeight} from './chartistConfig.js';
import {ctHighlighting} from '../chartist-plugins/chartist-plugin-highlighting.js';
import {ctColorOverwrite} from '../chartist-plugins/chartist-plugin-color-overwrite.js';
import min from './min';

export var types = {
  Bar: {
    chartistType: 'Bar',
    modifyData: (config, data, size, rect) => {
      if (config.horizontalBars) {
        // reverse data labels and data series for horizontal bars
        data.labels.reverse();
        data.series.reverse();
        data.series.map(serie => {
          serie.reverse();
        })
      }
    },
    options: [
      {
        name: 'isColumnChart',      // false would produce a bar chart (aka horizontal bar chart)
        modifyConfig: (config, value, data, size, rect) => {
          config.horizontalBars = !value;
          if (config.horizontalBars) {
            config.height = ((vertBarHeight * data.series.length) + vertBarSetPadding) * data.labels.length;

            config.axisX.showGrid = true;
            config.axisX.position = 'start';
            config.axisY.showGrid = false;

          } else {
            config.height = chartHeight;

            config.axisX.showGrid = false;
            config.axisX.position = 'end';
          }
        },
      },
      {
        name: 'forceBarsOnSmall',
        modifyConfig: (config, value, data, size, rect) => {
          if (value && size === 'small') {
            config.horizontalBars = true;
            config.height = ((vertBarHeight * data.series.length) + vertBarSetPadding) * data.labels.length;

            config.axisX.showGrid = true;
            config.axisX.position = 'start';
            config.axisY.showGrid = false;
          }
        }
      },
      {
        name: 'highlightDataSeries',
        modifyConfig: (config, value, data, size, rect) => {
          if (value !== null && value !== undefined) {
            config.plugins.push(
              ctHighlighting(value, !config.horizontalBars, data.series.length)
            )
          }
        }
      },
      {
        name: 'colorOverwrite',
        modifyConfig: (config, value, data, size, rect) => {
          if (value !== null && value !== undefined) {
            config.plugins.push(
              ctColorOverwrite(value, !config.horizontalBars)
            )
          }
        }
      }
    ]
  },
  StackedBar: {
    label: 'Stacked Bar',
    chartistType: 'Bar',
    modifyData: (config, data, size, rect) => {
      if (config.horizontalBars) {
        // reverse data labels and data series for horizontal bars
        data.labels.reverse();
        data.series.map(serie => {
          serie.reverse();
        });
      }
    },
    options: [
      {
        name: 'isColumnChart',      // false would produce a bar chart (aka horizontal bar chart)
        type: 'oneOf',
        labels: ['Säulen', 'Balken'],
        defaultValue: true,
        modifyConfig: (config, value, data, size, rect) => {
          config.horizontalBars = !value;
          if (config.horizontalBars) {
            config.height = (vertBarHeight + vertBarSetPadding) * data.labels.length;

            config.axisX.showGrid = true;
            config.axisX.position = 'start';
            config.axisY.showGrid = false;
          } else {
            config.height = chartHeight;

            config.axisX.showGrid = false;
            config.axisX.position = 'end';
          }
        }
      },
      {
        name: 'forceBarsOnSmall',
        type: 'boolean',
        label: 'Balken für Mobile',
        defaultValue: true,
        modifyConfig: (config, value, data, size, rect) => {
          if (value && size === 'small') {
            config.horizontalBars = true;
            config.height = (vertBarHeight + vertBarSetPadding) * data.labels.length;

            config.axisX.showGrid = true;
            config.axisX.position = 'start';
            config.axisY.showGrid = false;
          }
        }
      },
      {
        name: 'highlightDataSeries',
        type: 'selection',
        label: 'Hervorhebung',
        defaultValue: undefined,
        withUndefinedOption: true,
        undefinedOptionLabel: 'keine',
        options: [],
        modifyConfig: (config, value, data, size, rect) => {
          if (value !== null && value !== undefined) {
            config.plugins.push(
              ctHighlighting(value)
            )
          }
        }
      },
      {
        name: 'colorOverwrite',
        modifyConfig: (config, value, data, size, rect) => {
          if (value !== null && value !== undefined) {
            config.plugins.push(
              ctColorOverwrite(value, !config.horizontalBars)
            )
          }
        }
      }
    ]
  },
  Line: {
    label: 'Line',
    chartistType: 'Line',
    options: [
      {
        name: 'minValue',
        type: 'number',
        label: 'Minimaler Wert',
        defaultValue: undefined,
        modifyConfig: (config, value, data, size, rect) => {
          if (value && value !== '' && !isNaN(Number(value))) {
            config.low = Number(value);
          }
        }
      },
      {
        name: 'maxValue',
        type: 'number',
        label: 'Maximaler Wert',
        defaultValue: undefined,
        modifyConfig: (config, value, data, size, rect) => {
          if (value && value !== '' && !isNaN(Number(value))) {
            config.high = Number(value);
          }
        }
      },
      {
        name: 'highlightDataSeries',
        type: 'selection',
        label: 'Hervorhebung',
        defaultValue: undefined,
        withUndefinedOption: true,
        undefinedOptionLabel: 'keine',
        options: [],
        modifyConfig: (config, value, data, size, rect) => {
          if (value !== null && value !== undefined) {
            config.plugins.push(
              ctHighlighting(value, true, data.series.length)
            );
          }
        }
      },
      {
        name: 'colorOverwrite',
        modifyConfig: (config, value, data, size, rect) => {
          if (value !== null && value !== undefined) {
            config.plugins.push(
              ctColorOverwrite(value, !config.horizontalBars)
            )
          }
        }
      }
    ],
    modifyConfig: (config, data, size, rect) => {

      // do not set low if it's already set (by minValue option)
      if (typeof config.low !== 'undefined') {
        return;
      }

      // default low is 0
      config.low = 0;

      // if we have a value below 0, this is our low
      let minValue = min(data.series.map(serie => min(serie.map(datapoint => parseFloat(datapoint)))));
      if (minValue < 0) {
        config.low = minValue;
        return;
      }

      // check if we have 100 as first value on every serie (indexed data)
      let allFirstHundered = data.series.map(serie => serie[0]).reduce((prev, current) => {return parseInt(current) === 100},false);
      if (allFirstHundered && minValue >= 100) {
        config.low = 100;
      }

      return;
    }
  }
}
