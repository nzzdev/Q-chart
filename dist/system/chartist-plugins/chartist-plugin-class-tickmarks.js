System.register(['chartist'], function (_export) {
  'use strict';

  var Chartist, defaultOptions;

  _export('ctExtendTickmmarksClassNames', ctExtendTickmmarksClassNames);

  function ctExtendTickmmarksClassNames(options) {

    options = Object.assign(defaultOptions, options);

    return function ctExtendTickmmarksClassNames(chart) {
      if (chart instanceof Chartist.Line || chart instanceof Chartist.Bar) {
        chart.on('draw', function (data) {
          if (data.type === 'label') {

            var labelIndex = data.index;
            var labelClassList = data.element._node.lastChild.classList;
            var labelDirection = data.axis.units.dir;

            if (labelIndex === 0) {
              labelClassList.add('ct-' + labelDirection + '-' + options.first);
            }

            if (labelIndex === data.axis.ticks.length - 1) {
              labelClassList.add('ct-' + labelDirection + '-' + options.last);
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