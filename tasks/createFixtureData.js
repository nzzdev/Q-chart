const years = ['2016', '2017'];
const categories = ['Land A', 'Land Ä', 'Land B', 'Unglaublich langer Ländername C - nicht gut für mobile'];

const minValue = 0;
const maxValue = 100000;

function getMonthlyDataSeries() {
  let data = [
    [
      'Jahr',
      'Wert 1',
      'Wert 2'
    ]
  ];
  years.forEach(year => {
    for (var i = 1; i <= 12; i++) {
      // date format M-YYYY
      let date = `${i}-${year}`;
      data.push([
        date,
        '' + (Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue),
        '' + (Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue)
      ])
    }
  })
  return data;
}

function getCategoricalDataSeries() {
  let data = [
    [
      'Land',
      '2016',
      '2017'
    ]
  ];
  categories.forEach(category => {
    data.push([
      category,
      '' + (Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue),
      '' + (Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue)
    ]);
  })
  return data;
}

function createBasicLineChart() {
  let item = {
    title: 'FIXTURE: line chart time series',
    subtitle: 'some subtitle here',
    data: getMonthlyDataSeries(),
    sources: [
      {
        link: {},
        text: 'Bloomberg'
      }
    ],
    options: {
      chartType: 'Line',
      hideAxisLabel: false,
      barOptions: {
        isBarChart: false,
        forceBarsOnSmall: false
      },
      dateSeriesOptions: {
        interval: 'month',
        prognosisStart: null
      },
      lineChartOptions: {},
      colorOverwrite: [],
      highlightDataSeries: null
    }
  }
  return item;
}

function createBasicColumnChart() {
  let item = {
    title: 'FIXTURE: column chart basic',
    subtitle: 'some subtitle here',
    data: getCategoricalDataSeries(),
    options: {
      chartType: 'Bar',
      hideAxisLabel: false,
      barOptions: {
        isBarChart: false,
        forceBarsOnSmall: false,
      },
      dateSeriesOptions: {
        interval: 'year',
        prognosisStart: null
      },
      lineChartOptions: {},
      colorOverwrite: [],
      highlightDataSeries: null
    }
  }
  return item;
}

module.exports = {
  basicLineChart: createBasicLineChart,
  basicColumnChart: createBasicColumnChart
};
