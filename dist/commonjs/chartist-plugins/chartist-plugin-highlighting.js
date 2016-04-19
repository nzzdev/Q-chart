'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.ctHighlighting = ctHighlighting;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _chartist = require('chartist');

var _chartist2 = _interopRequireDefault(_chartist);

function ctHighlighting(highlightDataSeries, countAsc, dataLength) {
  if (countAsc === undefined) countAsc = true;

  var highLightedIndex = Number(highlightDataSeries);
  var hasHighlighted = highLightedIndex != null;

  return function ctHighlighting(chart) {

    var moveToFront = function moveToFront(el) {
      el.parentNode.appendChild(el);
    };

    chart.on('created', function (data) {
      try {
        if (hasHighlighted) {
          data.svg._node.classList.add('highlighted');
          var active = data.svg._node.querySelector('.active').parentNode;
          moveToFront(active);
        } else {
          data.svg._node.classList.remove('highlighted');
        }
      } catch (e) {}
    });

    chart.on('draw', function (data) {
      try {

        if (chart instanceof _chartist2['default'].Bar) {

          var index = countAsc ? data.seriesIndex : dataLength - 1 - data.seriesIndex;
          if (hasHighlighted && index === highLightedIndex) {
            data.element._node.classList.add('active');
          } else {
            data.element._node.classList.remove('active');
          }
        } else if (chart instanceof _chartist2['default'].Line) {

          var index = countAsc ? data.seriesIndex : dataLength - 1 - data.seriesIndex;
          if (hasHighlighted && index === highLightedIndex) {
            data.element._node.classList.add('active');
          } else {
            data.element._node.classList.remove('active');
          }
        }
      } catch (e) {}
    });
  };
}

;