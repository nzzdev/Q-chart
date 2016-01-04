System.register(['chartist'], function (_export) {
  'use strict';

  var Chartist, defaultOptions;

  _export('ctLabelClasses', ctLabelClasses);

  function isNumber(value) {
    return typeof parseInt(value) === 'number' && !isNaN(parseInt(value)) || typeof parseFloat(value) === 'number' && !isNaN(parseFloat(value));
  }

  function ctLabelClasses(options) {

    options = Object.assign(defaultOptions, options);

    return function ctLabelClasses(chart) {
      if (chart instanceof Chartist.Line || chart instanceof Chartist.Bar) {

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

          if (horizontalLabels && horizontalLabels.svgElements.length > 0) {
            addClass(horizontalLabels.svgElements[0], 'ct-horizontal--' + options.first);
            addClass(horizontalLabels.svgElements[horizontalLabels.svgElements.length - 1], 'ct-horizontal--' + options.last);
          }

          if (verticalLabels && verticalLabels.svgElements.length > 0) {
            addClass(verticalLabels.svgElements[0], 'ct-vertical--' + options.first);
            addClass(verticalLabels.svgElements[verticalLabels.svgElements.length - 1], 'ct-vertical--' + options.last);
          }
        });
      }
    };
  }

  function addClass(element, additionalClass) {
    if (element._node.nodeName === 'text') {
      element.addClass(additionalClass);
    } else {
      element.querySelector('.ct-label:last-child').addClass(additionalClass);
    }
  }
  return {
    setters: [function (_chartist) {
      Chartist = _chartist['default'];
    }],
    execute: function () {
      defaultOptions = {
        first: 'first',
        last: 'last'
      };
      ;
    }
  };
});