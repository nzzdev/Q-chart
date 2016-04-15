define(['exports', 'chartist'], function (exports, _chartist) {
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  exports.ctHighlighting = ctHighlighting;

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _Chartist = _interopRequireDefault(_chartist);

  function ctHighlighting(highlightDataRow, countAsc, dataLength, preventLabelClasses) {
    if (countAsc === undefined) countAsc = true;

    var highLightedIndex = Number(highlightDataRow);
    var hasHighlighted = highLightedIndex > -1;

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
          var index = countAsc ? data.index : dataLength - 1 - data.index;
          if (hasHighlighted && index === highLightedIndex) {
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
});