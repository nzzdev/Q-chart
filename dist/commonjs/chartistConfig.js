'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
var bar = {
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
    position: 'start'
  },
  axisY: {
    showGrid: false
  }

};

exports.bar = bar;
var line = {

  height: 200,

  showPoint: false,
  lineSmooth: false,
  axisX: {
    showGrid: true,
    showLabel: true,
    labelInterpolationFnc: function skipLabels(value, index) {
      return index % 12 === 0 ? value : null;
    }
  },
  axisY: {
    position: 'start',
    scaleMinSpace: 40
  }

};
exports.line = line;