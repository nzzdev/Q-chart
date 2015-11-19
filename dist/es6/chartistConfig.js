/*
// --- calculate height of vert bar charts container ---
// needs data!
var vertBarHeight = 10;
var vertBarSetPadding = 22;
var vertBarChartHeight = (((vertBarHeight)*data2.series.length)+vertBarSetPadding)*(data2.labels.length)
//console.log(vertBarChartHeight);
*/

export var bar = {

//    height: vertBarChartHeight,
    height: 1000,
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

/*	// plugin integration not finished yet
    plugins: [
     Chartist.plugins.ctExtendGridClassNames(),
     Chartist.plugins.ctProtrudeGrid()
    ]
*/

}

/*
// responsive options must be pushed individualy into the constructor

  var responsiveOptionsBar = [
  ['screen and (min-width: 414px)', {
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
    }]
  ];

*/

export var line = {

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

/*	// plugin integration not finished yet
    plugins: [
     Chartist.plugins.ctExtendGridClassNames(),
     Chartist.plugins.ctProtrudeGrid()
    ]
*/

}
