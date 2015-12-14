System.register(['chartist'], function (_export) {
  'use strict';

  var Chartist, defaultOptions;

  _export('ctProtrudeGrid', ctProtrudeGrid);

  function ctProtrudeGrid(options) {

    options = Object.assign(defaultOptions, options);

    return function ctProtrudeGrid(chart) {
      if (chart instanceof Chartist.Line || chart instanceof Chartist.Bar) {

        chart.on('draw', function (data) {

          try {
            if (data.type === 'grid' && data.element) {
              if (data.axis.counterUnits.dir === "vertical") {

                data.element._node.setAttribute('y1', parseInt(data.element._node.getAttribute('y1')) - options.protrude);
                data.element._node.setAttribute('y2', parseInt(data.element._node.getAttribute('y2')) + options.protrude);
              } else if (data.axis.counterUnits.dir === "horizontal") {
                  data.element._node.setAttribute('x1', parseInt(data.element._node.getAttribute('x1')) - options.protrude);
                  data.element._node.setAttribute('x2', parseInt(data.element._node.getAttribute('x2')) + options.protrude);
                }
            }
          } catch (e) {}
        });
      };
    };

    debugger;
  }

  return {
    setters: [function (_chartist) {
      Chartist = _chartist['default'];
    }],
    execute: function () {
      defaultOptions = {
        protrude: 5
      };
      ;
    }
  };
});