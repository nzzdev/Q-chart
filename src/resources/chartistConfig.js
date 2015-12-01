var vertBarHeight = 10;
var vertBarSetPadding = 22;

import {ctExtendGridClassNames} from '../chartist-plugins/chartist-plugin-class-axis.js';
import {ctProtrudeGrid} from '../chartist-plugins/chartist-plugin-protrude-grid.js';
import {ctGridOnTop} from '../chartist-plugins/chartist-plugin-grid-on-top.js';

var chartistConfigs = {

  bar: {
    small: {
      height: 200, // default will get overwritten by getConfig function called with data
      seriesBarDistance: 11,
      chartPadding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
      },   
      reverseData: false,
      horizontalBars: true,
      axisX: {   
        showGrid: true,
        position: 'start',
      },
      axisY: {
        showGrid: false,
      },
      plugins: [
       ctExtendGridClassNames(),
       ctProtrudeGrid(),
       ctGridOnTop()
      ]
    },
    large: {
      height: 200,
      fullWidth: true,
      seriesBarDistance: 11,
      chartPadding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
      },    
      reverseData: false,
      horizontalBars: false,
      axisX: {
        showGrid: false,
        position: 'end',
      },
      axisY: {
        showGrid: true
      },
      plugins: [
       ctExtendGridClassNames(),
       ctProtrudeGrid(),
       ctGridOnTop()
      ]
    },
  },

  line: {
    small: {
      height: 200,

      showPoint: false,
      lineSmooth: false,
      axisX: {
        showGrid: true,
        showLabel: true,
        /*
        labelInterpolationFnc: function skipLabels(value, index) {          // skips Labels, needs to be dynamic
            return index % 12  === 0 ? value : null;
        }
        */
      },
      axisY: {
        position: 'start',
        scaleMinSpace: 40
      },
      plugins: [
       ctExtendGridClassNames(),
       ctProtrudeGrid(),
       ctGridOnTop()
      ]
    },
    large: {
      height: 200,

      showPoint: false,
      lineSmooth: false,
      axisX: {
        showGrid: true,
        showLabel: true,
        /*
        labelInterpolationFnc: function skipLabels(value, index) {          // skips Labels, needs to be dynamic
            return index % 12  === 0 ? value : null;
        }
        */      },
      axisY: {
        position: 'start',
        scaleMinSpace: 40
      },
      plugins: [
       ctExtendGridClassNames(),
       ctProtrudeGrid(),
       ctGridOnTop()
      ]
    }
  }
}

export default function getConfig(type, size, data) {
  let config = chartistConfigs[type][size];

  // check the number of bars and switch to mobile layout if > 30 bars (not implemented)
  if ((data.series.length*data.labels.length) >= 30){
    console.log("+++ uh, more than 30 bars, better switch to mobile layout on desktop +++");
  }

  if (type === 'bar' && size === 'small') {
    config.height = (((vertBarHeight) * data.series.length) + vertBarSetPadding) * (data.labels.length);
  }
  return config;
}
