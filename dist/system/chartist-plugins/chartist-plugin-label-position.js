System.register(['chartist'], function (_export) {
  'use strict';

  var Chartist;

  _export('ctLabelPosition', ctLabelPosition);

  function ctLabelPosition() {

    return function ctLabelPosition(chart) {
      if (chart instanceof Chartist.Bar) {
        chart.on('draw', function (data) {
          if (data.type === 'label') {

            var labelDirection = data.axis.units.dir;

            if (!chart.options.horizontalBars && labelDirection === 'horizontal' && data.element._node.getComputedTextLength) {
              data.element._node.setAttribute('x', Math.floor(parseInt(data.element._node.getAttribute('x')) + parseInt(data.element._node.getAttribute('width')) / 2));
              data.element._node.removeAttribute('width');
            }

            if (chart.options.horizontalBars && labelDirection === 'vertical') {
              data.element._node.setAttribute('y', Math.floor(data.element._node.getAttribute('y') - data.element._node.getAttribute('height') / 2 + 15 / 4));
            }
          }
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