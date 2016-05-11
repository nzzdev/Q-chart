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

  return function ctHighlighting(chart) {

    var moveToFront = function moveToFront(el) {
      el.parentNode.appendChild(el);
    };

    chart.on('created', function (data) {
      try {
        data.svg.addClass('ct-contains-highlighted-el');
        var active = data.svg._node.querySelector('.ct-highlighted-el').parentNode;
        moveToFront(active);
      } catch (e) {}
    });

    chart.on('draw', function (data) {
      try {

        if (chart instanceof _chartist2['default'].Bar || chart instanceof _chartist2['default'].Line) {

          var index = countAsc ? data.seriesIndex : dataLength - 1 - data.seriesIndex;
          if (index === highLightedIndex) {
            data.element.addClass('ct-highlighted-el');
          } else {
            data.element.removeClass('ct-highlighted-el');
          }
        }
      } catch (e) {}
    });
  };
}

;