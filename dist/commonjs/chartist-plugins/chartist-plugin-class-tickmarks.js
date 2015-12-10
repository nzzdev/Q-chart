'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.ctExtendTickmmarksClassNames = ctExtendTickmmarksClassNames;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _chartist = require('chartist');

var _chartist2 = _interopRequireDefault(_chartist);

var defaultOptions = {
  first: 'first',
  last: 'last'
};

function ctExtendTickmmarksClassNames(options) {

  options = Object.assign(defaultOptions, options);

  return function ctExtendTickmmarksClassNames(chart) {
    if (chart instanceof _chartist2['default'].Line || chart instanceof _chartist2['default'].Bar) {
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

;