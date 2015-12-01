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
        modifyConfig: (config, value, size) => {
          config.horizontalBars = !value;
        }
      },
      {
        name: 'forceBarsOnSmall',
        type: 'oneOf',
        labels: ['columns', 'bars'],
        defaultValue: true,
        modifyConfig: (config, value, size) => {
          if (value && size === 'small') {
            config.horizontalBars = true;
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
        modifyConfig: (config, value, size) => {
          config.horizontalBars = !value;
        }
      },
      {
        name: 'forceBarsOnSmall',
        type: 'oneOf',
        labels: ['columns', 'bars'],
        defaultValue: true,
        modifyConfig: (config, value, size) => {
          if (value && size === 'small') {
            config.horizontalBars = true;
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
