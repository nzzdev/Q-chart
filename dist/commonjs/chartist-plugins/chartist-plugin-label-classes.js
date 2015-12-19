'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.ctLabelClasses = ctLabelClasses;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _chartist = require('chartist');

var _chartist2 = _interopRequireDefault(_chartist);

var defaultOptions = {
  first: 'first',
  last: 'last'
};

function isNumber(value) {
  return typeof parseInt(value) === 'number' && !isNaN(parseInt(value)) || typeof parseFloat(value) === 'number' && !isNaN(parseFloat(value));
}

function ctLabelClasses(options) {

  options = Object.assign(defaultOptions, options);

  return function ctLabelClasses(chart) {
    if (chart instanceof _chartist2['default'].Line || chart instanceof _chartist2['default'].Bar) {
      chart.on('draw', function (data) {
        if (data.type === 'label') {

          var labelDirection = data.axis.units.dir;
          var indexClass = '';

          if (data.index === 0) {
            indexClass = 'ct-' + labelDirection + '-' + options.first;
          }

          if (data.index === data.axis.ticks.length - 1) {
            indexClass = 'ct-' + labelDirection + '-' + options.last;
          }

          var typeClass = '';
          if (data.element._node.nodeName === 'text') {
            if (isNumber(data.element._node.textContent)) {
              typeClass = 'ct-label--number';
            }
          }

          if (data.element._node.nodeName === 'text') {
            data.element.addClass(indexClass);
            data.element.addClass(typeClass);
          } else {
            data.element.querySelector('.ct-label:last-child').addClass(indexClass);
            data.element.querySelector('.ct-label:last-child').addClass(typeClass);
          }
        }
      });
    }
  };
}

;