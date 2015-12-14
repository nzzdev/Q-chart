define(['exports', 'chartist'], function (exports, _chartist) {
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  exports.ctProtrudeGrid = ctProtrudeGrid;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _Chartist = _interopRequireDefault(_chartist);

  var defaultOptions = {
    protrude: 5
  };

  function ctProtrudeGrid(options) {

    options = Object.assign(defaultOptions, options);

    return function ctProtrudeGrid(chart) {
      if (chart instanceof _Chartist['default'].Line || chart instanceof _Chartist['default'].Bar) {

        chart.on('draw', function (data) {
          if (data.type === 'grid') {
            if (data.axis.counterUnits.dir === "vertical") {

              data.element._node.setAttribute('y1', parseInt(data.element._node.getAttribute('y1')) - options.protrude);
              data.element._node.setAttribute('y2', parseInt(data.element._node.getAttribute('y2')) + options.protrude);
            } else if (data.axis.counterUnits.dir === "horizontal") {
                data.element._node.setAttribute('x1', parseInt(data.element._node.getAttribute('x1')) - options.protrude);
                data.element._node.setAttribute('x2', parseInt(data.element._node.getAttribute('x2')) + options.protrude);
              }
          }
        });
      };
    };

    debugger;
  }

  ;
});