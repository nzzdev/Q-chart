define(['exports', 'chartist'], function (exports, _chartist) {
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  exports.ctLabelClasses = ctLabelClasses;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _Chartist = _interopRequireDefault(_chartist);

  var defaultOptions = {
    first: 'first',
    last: 'last'
  };

  function ctLabelClasses(options) {

    options = Object.assign(defaultOptions, options);

    return function ctLabelClasses(chart) {
      if (chart instanceof _Chartist['default'].Line || chart instanceof _Chartist['default'].Bar) {
        chart.on('draw', function (data) {
          if (data.type === 'label') {

            var labelDirection = data.axis.units.dir;
            var additionalClass;

            if (data.index === 0) {
              additionalClass = 'ct-' + labelDirection + '-' + options.first;
            }

            if (data.index === data.axis.ticks.length - 1) {
              additionalClass = 'ct-' + labelDirection + '-' + options.last;
            }

            if (additionalClass) {
              if (data.element._node.nodeName === 'text') {
                data.element.addClass(additionalClass);
              } else {
                data.element.querySelector('.ct-label:last-child').addClass(additionalClass);
              }
            }
          }
        });
      }
    };
  }

  ;
});