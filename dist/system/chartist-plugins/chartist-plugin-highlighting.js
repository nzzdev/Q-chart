System.register(['chartist'], function (_export) {
  'use strict';

  var Chartist;

  _export('ctHighlighting', ctHighlighting);

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

          if (chart instanceof Chartist.Bar) {

            var index = countAsc ? data.seriesIndex : dataLength - 1 - data.seriesIndex;
            if (hasHighlighted && index === highLightedIndex) {
              data.element._node.classList.add('active');
            } else {
              data.element._node.classList.remove('active');
            }
          } else if (chart instanceof Chartist.Line) {

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

  return {
    setters: [function (_chartist) {
      Chartist = _chartist['default'];
    }],
    execute: function () {
      ;
    }
  };
});