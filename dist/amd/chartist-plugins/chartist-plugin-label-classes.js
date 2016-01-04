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

  function isNumber(value) {
    return typeof parseInt(value) === 'number' && !isNaN(parseInt(value)) || typeof parseFloat(value) === 'number' && !isNaN(parseFloat(value));
  }

  function ctLabelClasses(options) {

    options = Object.assign(defaultOptions, options);

    return function ctLabelClasses(chart) {
      if (chart instanceof _Chartist['default'].Line || chart instanceof _Chartist['default'].Bar) {

        chart.on('draw', function (data) {
          if (data.type === 'label') {
            var typeClass = '';
            if (data.element._node.nodeName === 'text') {
              if (isNumber(data.element._node.textContent)) {
                typeClass = 'ct-label--number';
              }
            }
            addClass(data.element, typeClass);
          }
        });

        chart.on('created', function (data) {
          var horizontalLabels = data.svg.querySelectorAll('.ct-label.ct-horizontal');
          var verticalLabels = data.svg.querySelectorAll('.ct-label.ct-vertical');

          if (horizontalLabels.svgElements.length > 0) {
            addClass(horizontalLabels.svgElements[0], 'ct-horizontal--' + options.first);
            addClass(horizontalLabels.svgElements[horizontalLabels.svgElements.length - 1], 'ct-horizontal--' + options.last);
          }

          if (verticalLabels.svgElements.length > 0) {
            addClass(verticalLabels.svgElements[0], 'ct-vertical--' + options.first);
            addClass(verticalLabels.svgElements[verticalLabels.svgElements.length - 1], 'ct-vertical--' + options.last);
          }
        });
      }
    };
  }

  ;

  function addClass(element, additionalClass) {
    if (element._node.nodeName === 'text') {
      element.addClass(additionalClass);
    } else {
      element.querySelector('.ct-label:last-child').addClass(additionalClass);
    }
  }
});