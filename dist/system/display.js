System.register(['chartist', './styles.css!'], function (_export) {
  'use strict';

  var Chartist;

  _export('display', display);

  function display(item, element) {
    new Chartist.Bar(element, item.data, item.chartConfig);
  }

  return {
    setters: [function (_chartist) {
      Chartist = _chartist['default'];
    }, function (_stylesCss) {}],
    execute: function () {}
  };
});