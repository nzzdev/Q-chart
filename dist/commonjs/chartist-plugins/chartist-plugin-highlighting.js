'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.ctHighlighting = ctHighlighting;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _chartist = require('chartist');

var _chartist2 = _interopRequireDefault(_chartist);

function ctHighlighting(highlightDataRow, countAsc, dataLength, preventLabelClasses) {
  if (countAsc === undefined) countAsc = true;

  var highLightedIndex = Number(highlightDataRow);
  var hasHighlightedBar = highLightedIndex > -1;

  return function ctHighlighting(chart) {

    console.log('bla');
    chart.on('created', function (data) {
      try {
        var element = data.element;
        var options = data.options;

        if (hasHighlightedBar) {
          data.svg._node.classList.add('highlighted');
        } else {
          data.svg._node.classList.remove('highlighted');
        }
      } catch (e) {}
    });

    chart.on('draw', function (data) {
      var index = countAsc ? data.index : dataLength - 1 - data.index;
      try {
        if (hasHighlightedBar && index === highLightedIndex) {
          if (data.type === 'line' || data.type === 'bar' || data.type === 'label' && !preventLabelClasses) {
            data.element._node.classList.add('active');
          }
        } else {
          data.element._node.classList.remove('active');
        }
      } catch (e) {}
    });
  };
}

;