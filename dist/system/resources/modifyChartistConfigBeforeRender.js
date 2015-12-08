System.register([], function (_export) {
  'use strict';

  _export('modifyChartistConfigBeforeRender', modifyChartistConfigBeforeRender);

  function modifyChartistConfigBeforeRender(config, type, data, size, rect) {
    if (type === 'Bar' && size === 'large') {}
  }

  return {
    setters: [],
    execute: function () {}
  };
});