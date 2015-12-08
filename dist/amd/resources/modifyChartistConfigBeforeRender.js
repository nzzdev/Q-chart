define(['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });
  exports.modifyChartistConfigBeforeRender = modifyChartistConfigBeforeRender;

  function modifyChartistConfigBeforeRender(config, type, data, size, rect) {
    if (type === 'Bar' && size === 'large') {}
  }
});