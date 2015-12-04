var vertBarHeight = 10;
var vertBarSetPadding = 22;

import {ctExtendGridClassNames} from '../chartist-plugins/chartist-plugin-class-axis.js';
//import {ctProtrudeGrid} from '../chartist-plugins/chartist-plugin-protrude-grid.js';
import {ctGridOnTop} from '../chartist-plugins/chartist-plugin-grid-on-top.js';

var chartistConfigs = {

  Bar: {
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
//       ctProtrudeGrid(),
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
//       ctProtrudeGrid(),
       ctGridOnTop()
      ]
    },
  },

  StackedBar: {
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
      stackBars: true,
      axisX: {   
        showGrid: true,
        position: 'start',
      },
      axisY: {
        showGrid: false,
      },
      plugins: [
       ctExtendGridClassNames(),
//       ctProtrudeGrid(),
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
      stackBars: true,
      axisX: {
        showGrid: false,
        position: 'end',
      },
      axisY: {
        showGrid: true
      },
      plugins: [
       ctExtendGridClassNames(),
//       ctProtrudeGrid(),
       ctGridOnTop()
      ]
    },
  },

  Line: {
    small: {
      height: 200,

      showPoint: false,
      lineSmooth: false,
      axisX: {
        showGrid: true,
        showLabel: true,
        
        labelInterpolationFnc: function skipLabels(value, index) {          // skips Labels, needs to be dynamic
            return index % 12  === 0 ? value : null;
        }
        
        
      },
      axisY: {
        position: 'start',
        scaleMinSpace: 40
      },
      plugins: [
       ctExtendGridClassNames(),
//       ctProtrudeGrid(),
       ctGridOnTop(),
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
        labelOffset: {
          x:-25,
          y:0
        },
        */
        
        
        labelInterpolationFnc: function skipLabels(value, index) {          // skips Labels, needs to be dynamic
            return index % 12  === 0 ? value : null;
        }
        
              },
      axisY: {
        position: 'start',
        scaleMinSpace: 40
      },
      plugins: [
       ctExtendGridClassNames(),
//       ctProtrudeGrid(),
       ctGridOnTop(),
      ]
    }
  }
}

export default function getConfig(type, size, data) {
  let config = chartistConfigs[type][size];

  // if Bar: check the number of bars and recommend/switch to mobile layout if > 30 bars (not implemented yet, just log)
  if (type === 'Bar' && (data.series.length*data.labels.length >= 30)){
    console.log('+++ uh, barchart and more than 30 bars, better switch to mobile layout on desktop +++');
  }

  // if BAR: check the number of datapoints and recommend LINE if number of datapoints > 12   (not implemented, just log)
  if (type === 'Bar' && data.series[0].length >= 12){
    console.log('+++ uh, barchart and more than 12 datapoints in first series. so many bars, what about a nice linechart instead +++');
  }

  // if LINE: check the number of datapoints and recommend BAR if number of datapoints <= 12  (not implemented, just log)
  if (type === 'Line' && data.series[0].length < 12){
    console.log('+++ uh, linechart and less than 12 datapoints in first series. might look chunky, what about a nice bar chart instead +++');
  }

  // when barchart = small calculated height automaticly
  if (type === 'Bar' && size === 'small'){
    console.log('+++');
    config.height = ((vertBarHeight*data.series.length)+vertBarSetPadding)*(data.labels.length);
  }

  return config;
}
