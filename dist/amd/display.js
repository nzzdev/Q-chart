define(['exports', 'chartist', './styles.css!'], function (exports, _chartist, _stylesCss) {
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  exports.display = display;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _Chartist = _interopRequireDefault(_chartist);

  function display(item, element) {
    new _Chartist['default'].Bar(element, item.data, item.chartConfig);
  }
});