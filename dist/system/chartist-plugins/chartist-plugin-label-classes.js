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
            var indexClass = '';

            if (data.index === 0) {
              indexClass = 'ct-' + labelDirection + '-' + options.first;
            }

            if (data.index === data.axis.ticks.length - 1) {
              indexClass = 'ct-' + labelDirection + '-' + options.last;
            }

            var typeClass = '';
            if (data.axis.units.pos === 'x') {
              if (chart.options.qItem && chart.options.qItem.data.x.type && chart.options.qItem.data.x.type.id) {
                typeClass = 'ct-label--type-' + chart.options.qItem.data.x.type.id;
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