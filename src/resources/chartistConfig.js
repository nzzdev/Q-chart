import {ctProtrudeGrid} from '../chartist-plugins/chartist-plugin-protrude-grid.js';
import {ctBaseline} from '../chartist-plugins/chartist-plugin-baseline.js';
import {ctLabelClasses} from '../chartist-plugins/chartist-plugin-label-classes.js';
import {ctLabelPosition} from '../chartist-plugins/chartist-plugin-label-position.js';
import {ctExtendFitBarsToData} from '../chartist-plugins/chartist-plugin-fit-bars.js';
import {ctSeriesClassOrder} from '../chartist-plugins/chartist-plugin-series-class-order.js';
import {ctSophieVizColorClasses} from '../chartist-plugins/chartist-plugin-sophie-viz-color-classes.js';

import clone from './clone';

export var vertBarHeight = 10;
export var vertBarSetPadding = 22;
export var chartHeight = 200;

var chartistClassNamesConfig = {
  chart: 'ct-chart-line',
  label: 'ct-label s-font-note-s s-font-note-s--light',
  labelGroup: 'ct-labels',
  series: 'ct-series',
  line: 'ct-line',
  point: 'ct-point',
  area: 'ct-area',
  grid: 'ct-grid',
  gridGroup: 'ct-grids',
  vertical: 'ct-vertical',
  horizontal: 'ct-horizontal',
  start: 'ct-start',
  end: 'ct-end'
}

export var chartistConfigs = {

  Bar: {
    small: {
      height: chartHeight,
      seriesBarDistance: 11,
      chartPadding: {
        top: 0,
        right: 1,
        bottom: 0,
        left: 0
      },   
      reverseData: false,
      horizontalBars: true,
      axisX: {
      },
      axisY: {
      },
      plugins: [
        ctLabelClasses(),
        ctLabelPosition(),
        ctProtrudeGrid(),
        ctBaseline(),
        ctSophieVizColorClasses(),
        ctSeriesClassOrder(),
      ],
      classNames: chartistClassNamesConfig
    },
    large: {
      height: chartHeight,
      fullWidth: true,
      seriesBarDistance: 11,
      chartPadding: {
        top: 0,
        right: 1,
        bottom: 0,
        left: 0
      },
      reverseData: false,
      horizontalBars: false,
      axisX: {
      },
      axisY: {
      },
      plugins: [
        ctLabelClasses(),
        ctLabelPosition(),
        ctProtrudeGrid(),
        ctBaseline(),
        ctExtendFitBarsToData(),
        ctSophieVizColorClasses(),
        ctSeriesClassOrder(),
      ],
      classNames: chartistClassNamesConfig
    },
  },

  StackedBar: {
    small: {
      height: chartHeight,
      seriesBarDistance: 11,
      chartPadding: {
        top: 0,
        right: 1,
        bottom: 0,
        left: 0
      },   
      reverseData: false,
      horizontalBars: true,
      stackBars: true,
      axisX: {
      },
      axisY: {
      },
      plugins: [
        ctLabelClasses(),
        ctLabelPosition(),
        ctProtrudeGrid(),
        ctBaseline(),
        ctSophieVizColorClasses()
      ],
      classNames: chartistClassNamesConfig
    },
    large: {
      height: chartHeight,
      fullWidth: true,
      seriesBarDistance: 11,
      chartPadding: {
        top: 0,
        right: 1,
        bottom: 0,
        left: 0
      },
      reverseData: false,
      horizontalBars: false,
      stackBars: true,
      axisX: {
      },
      axisY: {
      },
      plugins: [
        ctLabelClasses(),
        ctLabelPosition(),
        ctProtrudeGrid(),
        ctBaseline(),
        ctExtendFitBarsToData(),
        ctSophieVizColorClasses()
      ],
      classNames: chartistClassNamesConfig
    },
  },

  Line: {
    small: {
      height: chartHeight,
      chartPadding: {
        top: 0,
        right: 1,
        bottom: 0,
        left: 0
      },
      showPoint: false,
      lineSmooth: false,
      fullWidth: true,
      axisX: {
        showGrid: true,
        showLabel: true,
      },
      axisY: {
        showGrid: true,
        position: 'start',
        scaleMinSpace: 40
      },
      plugins: [
        ctLabelClasses(),
        ctLabelPosition(),
        ctProtrudeGrid(),
        ctBaseline(),
        ctSophieVizColorClasses()
      ],
      classNames: chartistClassNamesConfig
    },
    large: {
      height: chartHeight,
      chartPadding: {
        top: 0,
        right: 1,
        bottom: 0,
        left: 0
      },
      showPoint: false,
      lineSmooth: false,
      fullWidth: true,
      axisX: {
        showGrid: true,
        showLabel: true,
      },
      axisY: {
        showGrid: true,
        position: 'start',
        scaleMinSpace: 40
      },
      plugins: [
        ctLabelClasses(),
        ctLabelPosition(),
        ctProtrudeGrid(),
        ctBaseline(),
        ctSophieVizColorClasses()
      ],
      classNames: chartistClassNamesConfig
    }
  }
}

export function getConfig(item, size) {
  let config = clone(chartistConfigs[item.type][size]);

  // if Bar: check the number of bars and recommend/switch to mobile layout if > 30 bars (not implemented yet, just log)
  // if (type === 'Bar' && (data.series.length*data.labels.length >= 30)){
  //   console.log('+++ uh, barchart and more than 30 bars, better switch to mobile layout on desktop +++');
  // }

  // // if BAR: check the number of datapoints and recommend LINE if number of datapoints > 12   (not implemented, just log)
  // if (type === 'Bar' && data.series[0].length >= 12){
  //   console.log('+++ uh, barchart and more than 12 datapoints in first series. so many bars, what about a nice linechart instead +++');
  // }

  // // if LINE: check the number of datapoints and recommend BAR if number of datapoints <= 12  (not implemented, just log)
  // if (type === 'Line' && data.series[0].length < 12){
  //   console.log('+++ uh, linechart and less than 12 datapoints in first series. might look chunky, what about a nice bar chart instead +++');
  // }

  return config;
}
