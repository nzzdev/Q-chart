'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.ctGridClasses = ctGridClasses;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _chartist = require('chartist');

var _chartist2 = _interopRequireDefault(_chartist);

function ctGridClasses() {

  return function ctGridClasses(chart) {
    if (chart instanceof _chartist2['default'].Line || chart instanceof _chartist2['default'].Bar) {
      chart.on('draw', function (data) {

        if (data.type === 'grid') {
          var lineIndex = data.index;

          if (data.axis.ticks[lineIndex] === 0) {
            data.element.addClass('ct-baseline');
          }
        }
      });
    }
  };
}

;