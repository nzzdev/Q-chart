const array2d = require('array2d');

const years = ['2016', '2017', '2018'];
const categories = ['Land A', 'Land Ä', 'Land B', 'Unglaublich langer Ländername C - nicht gut für mobile'];

const minValue = 0;
const maxValue = 100000;

function getMonthlyDataSeries() {
  let data = [
    [
      'Datum',
      'Kat 1',
      'Kat 2'
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

function getYearlyDataSeries() {
  let data = [
    [
      'Jahr',
      'Kat 1',
      'Kat 2'
    ]
  ];
  years.forEach(year => {
    data.push([
      year, 
      '' + (Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue),
      '' + (Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue)
    ])
  })
  return data;
}

function getCategoricalDataSeries() {
  let data = [
    [
      null
    ]
  ];
  years.forEach(year => {
    data[0].push(year);
  });
  categories.forEach((category, index) => {
    data.push([
      category
    ]);
    years.forEach(year => {
      data[index + 1].push('' + (Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue));
    });
  })
  return data;
}

function createBasicLineChart() {
  let item = {
    title: 'FIXTURE: line chart basic',
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

function createLineChartPrognosis() {
  let item = createBasicLineChart();
  item.title = 'FIXTURE: line chart prognosis';
  const prognosisRange = Math.floor(item.data.length / 3)
  item.options.dateSeriesOptions.prognosisStart = item.data.length - prognosisRange;
  return item;
}

function createLineChartHighlight() {
  let item = createBasicLineChart();
  item.title = 'FIXTURE: line chart highlight first';
  item.options.highlightDataSeries = 0;
  return item;
}

function createMobileBarChart() {
  let item = createBasicColumnChart();
  item.title = 'FIXTURE: bar chart mobile';
  item.options.barOptions.forceBarsOnSmall = true;
  return item;
}

function createBarChart() {
  let item = createBasicColumnChart();
  item.title = 'FIXTURE: bar chart basic';
  item.options.barOptions.isBarChart =  true;
  return item;
}

function createStackedMobileBarChart() {
  let item = createBasicColumnChart();
  item.title = 'FIXTURE: stacked column/bar mobile chart';
  item.options.chartType = 'StackedBar';
  item.options.barOptions.forceBarsOnSmall = true;
  return item;
}

function createTransposedMobileBarChart() {
  let item = createBasicColumnChart();
  item.title = 'FIXTURE: transposed bar mobile chart';
  item.data = array2d.transpose(item.data);
  item.options.barOptions.forceBarsOnSmall = true;
  return item;
}

function createMobileBarChartHighlight() {
  let item = createBasicColumnChart();
  item.title = 'FIXTURE: bar mobile chart hightlight second';
  item.options.barOptions.forceBarsOnSmall = true;
  item.options.highlightDataSeries = 1;
  return item;
}

module.exports = {
  basicLineChart: createBasicLineChart,
  lineChartPrognosis: createLineChartPrognosis,
  lineChartHighlight: createLineChartHighlight,
  basicColumnChart: createBasicColumnChart,
  basicBarChart: createBarChart,
  mobileBarChart: createMobileBarChart,
  stackedMobileBarChart: createStackedMobileBarChart,
  transposedMobileBarChart: createTransposedMobileBarChart,
  mobileBarChartHighlight: createMobileBarChartHighlight
};
