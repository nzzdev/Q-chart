System.register(['chartist'], function (_export) {
  'use strict';

  var Chartist, defaultOptions;

  _export('ctLabelClasses', ctLabelClasses);

  function ctLabelClasses(options) {

    options = Object.assign(defaultOptions, options);

    return function ctLabelClasses(chart) {
      if (chart instanceof Chartist.Line || chart instanceof Chartist.Bar) {
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