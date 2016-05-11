System.register(['chartist'], function (_export) {
  'use strict';

  var Chartist;

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
          data.svg.addClass('ct-contains-highlighted-el');
          var active = data.svg._node.querySelector('.ct-highlighted-el').parentNode;
          moveToFront(active);
        } catch (e) {}
      });

      chart.on('draw', function (data) {
        try {

          if (chart instanceof Chartist.Bar || chart instanceof Chartist.Line) {

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

  return {
    setters: [function (_chartist) {
      Chartist = _chartist['default'];
    }],
    execute: function () {
      ;
    }
  };
});