System.register(['./env'], function (_export) {
  'use strict';

  var env;
  return {
    setters: [function (_env) {
      env = _env['default'];
    }],
    execute: function () {
      _export('default', {
        title: 'My Chart',
        tool: 'chart',
        toolVersion: env.TOOL_VERSION,
        sources: [],
        data: {
          x: {
            label: 'date',
            data: ['2000-01-01', '2000-02-01', '2000-03-01', '2000-04-01', '2000-05-01', '2000-06-01', '2000-07-01', '2000-08-01', '2000-09-01', '2000-10-01', '2000-11-01', '2000-12-01']
          },
          series: [{
            label: 'Juice',
            data: [106.3, 106.0, 105.4, 101.8, 95.9, 94.1, 102.0, 98.5, 105.1, 99.0, 97.7, 88.2]
          }, {
            label: 'Travel',
            data: [49.843099, 49.931931, 61.478163, 58.981617, 61.223861, 65.601574, 67.89832, 67.028338, 56.441629, 58.83421, 56.283261, 55.38028]
          }]
        },
        chartConfig: {},
        chartType: 'Bar'
      });
    }
  };
});