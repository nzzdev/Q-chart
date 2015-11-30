var vertBarHeight = 10;
var vertBarSetPadding = 22;

var chartistConfigs = {

  bar: {
    small: {
      height: 200, // default will get overwritten by getConfig function called with data
      chartPadding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
      },   
      reverseData: true,
      horizontalBars: true,
      seriesBarDistance: 11,
      axisX: {   
        showGrid: true,
        position: 'start',
      },
      axisY: {
        showGrid: false,
      },
    },
    large: {
      height: 200,
      fullWidth: true,
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
      }
    },

  	// plugin integration not finished yet
      plugins: [
       Chartist.plugins.ctExtendGridClassNames(),
       Chartist.plugins.ctProtrudeGrid()
      ]
  
  },

  line: {
    small: {
      height: 200,

      showPoint: false,
      lineSmooth: false,
      axisX: {
        showGrid: true,
        showLabel: true,
        labelInterpolationFnc: function skipLabels(value, index) {
            return index % 12  === 0 ? value : null;
        }
      },
      axisY: {
        position: 'start',
        scaleMinSpace: 40
      },
    },
    large: {
      height: 200,

      showPoint: false,
      lineSmooth: false,
      axisX: {
        showGrid: true,
        showLabel: true,
        labelInterpolationFnc: function skipLabels(value, index) {
            return index % 12  === 0 ? value : null;
        }
      },
      axisY: {
        position: 'start',
        scaleMinSpace: 40
      },
    },

  // plugin integration not finished yet
    plugins: [
     Chartist.plugins.ctExtendGridClassNames(),
     Chartist.plugins.ctProtrudeGrid()
    ]

  }

}

export default function getConfig(type, size, data) {
  let config = chartistConfigs[type][size];
  if (type === 'bar' && size === 'small') {
    config.height = (((vertBarHeight) * data.y.data.length) + vertBarSetPadding) * (data.labels.length);
  }
  return config;
}
