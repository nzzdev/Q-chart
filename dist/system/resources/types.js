System.register([], function (_export) {
  'use strict';

  var types;
  return {
    setters: [],
    execute: function () {
      types = {
        Bar: {
          label: 'Bar',
          chartistType: 'Bar',
          options: [{
            name: 'isColumnChart',
            type: 'oneOf',
            labels: ['columns', 'bars'],
            defaultValue: true,
            modifyConfig: function modifyConfig(config, value, size) {
              config.horizontalBars = !value;
            }
          }, {
            name: 'forceBarsOnSmall',
            type: 'oneOf',
            labels: ['columns', 'bars'],
            defaultValue: true,
            modifyConfig: function modifyConfig(config, value, size) {
              if (value && size === 'small') {
                config.horizontalBars = true;
              }
            }
          }]
        },
        StackedBar: {
          label: 'Stacked Bar',
          chartistType: 'Bar',
          options: [{
            name: 'isColumnChart',
            type: 'oneOf',
            labels: ['columns', 'bars'],
            defaultValue: true,
            modifyConfig: function modifyConfig(config, value, size) {
              config.horizontalBars = !value;
            }
          }, {
            name: 'forceBarsOnSmall',
            type: 'oneOf',
            labels: ['columns', 'bars'],
            defaultValue: true,
            modifyConfig: function modifyConfig(config, value, size) {
              if (value && size === 'small') {
                config.horizontalBars = true;
              }
            }
          }]
        },
        Line: {
          label: 'Line',
          chartistType: 'Line',
          options: []
        }
      };

      _export('types', types);
    }
  };
});