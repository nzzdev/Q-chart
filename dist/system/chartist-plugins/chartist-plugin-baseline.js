System.register(['chartist'], function (_export) {
  'use strict';

  var Chartist;

  _export('ctBaseline', ctBaseline);

  function ctBaseline() {
    return function ctBaseline(chart) {
      if (chart instanceof Chartist.Line || Chartist.Bar) {

        chart.on('draw', function (data) {
          try {
            if (data.type === 'grid') {
              var lineIndex = data.index;

              if (data.axis.ticks[lineIndex] === 0) {
                data.element.addClass('ct-baseline');
              }
            }
          } catch (e) {}
        });

        chart.on('created', function () {
          try {
            var baselineGroup = chart.svg.elem('g').addClass('ct-baseline-group');
            var baselineLine = chart.svg.querySelector('.ct-baseline');
            baselineGroup.append(baselineLine);
            chart.svg.append(baselineGroup);
          } catch (e) {}
        });
      }
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