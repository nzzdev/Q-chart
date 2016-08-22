System.register(['chartist', '../resources/vizColors.js'], function (_export) {
  'use strict';

  var Chartist, brightVizColorClasses;

  _export('ctHighlighting', ctHighlighting);

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

          if (chart instanceof Chartist.Bar || chart instanceof Chartist.Line) {

            var index = countAsc ? data.seriesIndex : dataLength - 1 - data.seriesIndex;
            if (index === highLightedIndex) {
              data.element.addClass('ct-highlighted');
              data.element.removeClass(brightVizColorClasses[index]);
            } else {
              data.element.removeClass('ct-highlighted');
              data.element.addClass(brightVizColorClasses[index]);
            }
          }
        } catch (e) {}
      });
    };
  }

  return {
    setters: [function (_chartist) {
      Chartist = _chartist['default'];
    }, function (_resourcesVizColorsJs) {
      brightVizColorClasses = _resourcesVizColorsJs.brightVizColorClasses;
    }],
    execute: function () {
      ;
    }
  };
});