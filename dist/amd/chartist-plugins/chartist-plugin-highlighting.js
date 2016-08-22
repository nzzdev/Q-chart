define(['exports', 'chartist', '../resources/vizColors.js'], function (exports, _chartist, _resourcesVizColorsJs) {
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  exports.ctHighlighting = ctHighlighting;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _Chartist = _interopRequireDefault(_chartist);

  function ctHighlighting(highlightDataSeries, countAsc, dataLength) {
    if (countAsc === undefined) countAsc = true;

    var highLightedIndex = Number(highlightDataSeries);

    return function ctHighlighting(chart) {

      var moveToFront = function moveToFront(el) {
        el.parentNode.appendChild(el);
      };

      chart.on('created', function (data) {
        try {
          data.svg.addClass('ct-contains-highlighted');
          var active = data.svg._node.querySelector('.ct-highlighted').parentNode;
          moveToFront(active);
        } catch (e) {}
      });

      chart.on('draw', function (data) {
        try {

          if (chart instanceof _Chartist['default'].Bar || chart instanceof _Chartist['default'].Line) {

            var index = countAsc ? data.seriesIndex : dataLength - 1 - data.seriesIndex;
            if (index === highLightedIndex) {
              data.element.addClass('ct-highlighted');
              data.element.removeClass(_resourcesVizColorsJs.brightVizColorClasses[index]);
            } else {
              data.element.removeClass('ct-highlighted');
              data.element.addClass(_resourcesVizColorsJs.brightVizColorClasses[index]);
            }
          }
        } catch (e) {}
      });
    };
  }

  ;
});