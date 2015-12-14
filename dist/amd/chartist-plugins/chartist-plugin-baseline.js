define(['exports', 'chartist'], function (exports, _chartist) {
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  exports.ctBaseline = ctBaseline;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _Chartist = _interopRequireDefault(_chartist);

  function ctBaseline() {
    return function ctBaseline(chart) {
      if (chart instanceof _Chartist['default'].Line || _Chartist['default'].Bar) {

        chart.on('draw', function (data) {
          if (data.type === 'grid') {
            var lineIndex = data.index;

            if (data.axis.ticks[lineIndex] === 0) {
              data.element.addClass('ct-baseline');
            }
          }
        });

        chart.on('created', function () {
          var baselineGroup = chart.svg.elem('g').addClass('ct-baseline-group');
          var baselineLine = chart.svg.querySelector('.ct-baseline');
          baselineGroup.append(baselineLine);
          chart.svg.append(baselineGroup);
        });
      }
    };
  }

  ;
});