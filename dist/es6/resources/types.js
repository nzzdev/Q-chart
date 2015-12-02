var vertBarHeight = 10;
var vertBarSetPadding = 22;

export var types = {
  Bar: {
    label: 'Bar',
    chartistType: 'Bar',
    options: [
      {
        name: 'isColumnChart',      // the opposite would produce a bar chart (aka horizontal bar chart)
        type: 'oneOf',
        labels: ['columns', 'bars'],
        defaultValue: true,
        modifyConfig: (config, value, size, data) => {
          config.horizontalBars = !value;
          if (config.horizontalBars) {
            config.height = (((vertBarHeight) * data.series.length) + vertBarSetPadding) * (data.labels.length);
          }
        }
      },
      {
        name: 'forceBarsOnSmall',
        type: 'boolean',
        label: 'forceBarsOnSmall',
        defaultValue: true,
        modifyConfig: (config, value, size, data) => {
          if (value && size === 'small') {
            config.horizontalBars = true;
            config.height = (((vertBarHeight) * data.series.length) + vertBarSetPadding) * (data.labels.length);
          }
        }
      }
    ]
  },
  StackedBar: {
    label: 'Stacked Bar',
    chartistType: 'Bar',
    options: [
      {
        name: 'isColumnChart',      // the opposite would produce a bar chart (aka horizontal bar chart)
        type: 'oneOf',
        labels: ['columns', 'bars'],
        defaultValue: true,
        modifyConfig: (config, value, size, data) => {
          config.horizontalBars = !value;
          if (config.horizontalBars) {
            config.height = (((vertBarHeight) * data.series.length) + vertBarSetPadding) * (data.labels.length);
          }
        }
      },
      {
        name: 'forceBarsOnSmall',
        type: 'boolean',
        label: 'forceBarsOnSmall',
        defaultValue: true,
        modifyConfig: (config, value, size, data) => {
          if (value && size === 'small') {
            config.horizontalBars = true;
            config.height = (((vertBarHeight) * data.series.length) + vertBarSetPadding) * (data.labels.length);
          }
        }
      }
    ]
  },
  Line: {
    label: 'Line',
    chartistType: 'Line',
    options: []
  },
}
