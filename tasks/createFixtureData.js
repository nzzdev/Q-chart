const array2d = require('array2d');

const years = [
  '2004',
  '2005',
  '2006',
  '2007',
  '2008',
  '2009',
  '2010',
  '2011',
  '2012',
  '2013',
  '2014',
  '2015',
  '2016',
  '2017',
  '2018'
];

const categories = [
  'Land A Unglaublich langer Ländername', 
  'Land Ä Unglaublich langer Ländername', 
  'Land B', 
  'Unglaublich langer Ländername C - nicht gut für mobile',
  'Land D', 
  'Land E', 
  'Land F', 
  'Land G', 
  'Land H', 
  'Land I', 
  'Land J', 
  'Land K', 
  'Land L Land L Land L',
  'Land M', 
  'Land N', 
  'Land O', 
  'Land P Land P Land P Land P Land P Land P', 
  'Land Q', 
  'Land R', 
  'Land S', 
  'Land T', 
  'Land U'
];

const minValue = 0;
const maxValue = 100000;

function getMonthlyDataSeries(yearsPortion, categoriesPortion) {
  let data = [
    [
      'Month'
    ]
  ];
  // insert categories
  categoriesPortion.forEach(category => {
    data[0].push(category);
  });
  // for each year create an entry per month with number categories random values
  yearsPortion.forEach((year, index) => {
    for (var i = 1; i <= 12; i++) {
      // date format M-YYYY
      let date = `${i}-${year}`;
      let entry = [
        date
      ];

      for (var j = 0; j < categoriesPortion.length; j++) {
        entry.push('' + (Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue));
      }
      data.push(entry);
    }
  })
  return data;
}

function getYearlyDataSeries(yearsPortion, categoriesPortion) {
  let data = [
    [
      'Year'
    ]
  ];
  // insert categories
  categoriesPortion.forEach(category => {
    data[0].push(category);
  });
  // for each year create an entry with number categories values
  yearsPortion.forEach((year, index) => {
    data.push([
      year
    ]);
    categoriesPortion.forEach(category => {
      data[index + 1].push('' + (Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue));
    })
  })
  return data;
}

// can be changed to monthly as well, does not make so much sense for columns/bars
function getCategoricalDataSeries(yearsPortion, categoriesPortion) {
  let data = getYearlyDataSeries(yearsPortion, categoriesPortion);
  return array2d.transpose(data);
}

function createBasicLineChart(numberOfCategories = 1) {
  let item = {
    title: 'FIXTURE: line chart basic',
    subtitle: 'some subtitle here',
    data: getMonthlyDataSeries(years.slice(years.length - 3), categories.slice(0, numberOfCategories)), // last 3 of years array, first 4 of categories array
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

function createLineChartAllCategories() {
  let item = {
    title: 'FIXTURE: line chart all categories',
    subtitle: 'some subtitle here',
    data: getMonthlyDataSeries(years.slice(years.length - 3), categories), // last 3 of years array, all arrays
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
    data: getCategoricalDataSeries(years.slice(years.length - 3), categories.slice(0, 4)), // 3 years, subset of 4 categories
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

function createTransposedColumnChart() {
  let item = {
    title: 'FIXTURE: column chart transposed',
    subtitle: 'some subtitle here',
    data: getYearlyDataSeries(years.slice(years.length - 3), categories.slice(0, 4)), // 3 years, subset of 4 categories
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

function createColumnChartAll() {
  let item = {
    title: 'FIXTURE: column chart all years, all categories',
    subtitle: 'some subtitle here',
    data: getCategoricalDataSeries(years, categories), // all predefined years and categories
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

function createColumnChartAllYears() {
  let item = {
    title: 'FIXTURE: column chart all years, few categories',
    subtitle: 'some subtitle here',
    data: getCategoricalDataSeries(years, categories.slice(0, 2)), // all years, subset of 2 categories
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

function createColumnChartAllCategories() {
  let item = {
    title: 'FIXTURE: column chart one year, all categories',
    subtitle: 'some subtitle here',
    data: getCategoricalDataSeries(years.slice(years.length - 1), categories), // one year, all categories
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
  let item = createBasicLineChart(3);
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
  let item = createTransposedColumnChart();
  item.title = 'FIXTURE: transposed bar mobile chart';
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

function createBarChartAll() {
  let item = createColumnChartAll();
  item.title = 'FIXTURE: large bar chart with all years, all categories';
  item.options.barOptions.isBarChart = true;
  return item;
}

function createBarChartAllYears() {
  let item = createColumnChartAllYears();
  item.title = 'FIXTURE: bar chart all years, few categories';
  item.options.barOptions.isBarChart = true;
  return item;
}

function createBarChartAllCategories() {
  let item = createColumnChartAllCategories();
  item.title = 'FIXTURE: bar chart one year, all categories';
  item.options.barOptions.isBarChart = true;
  return item;
}

function createStackedBarAll() {
  let item = createColumnChartAll();
  item.title = 'FIXTURE: stacked bar chart all years, all categories';
  item.options.chartType = 'StackedBar';
  return item;
}

module.exports = {
  basicLineChart: createBasicLineChart,
  lineChartAllCategories: createLineChartAllCategories,
  lineChartPrognosis: createLineChartPrognosis,
  lineChartHighlight: createLineChartHighlight,
  basicColumnChart: createBasicColumnChart,
  basicBarChart: createBarChart,
  mobileBarChart: createMobileBarChart,
  stackedMobileBarChart: createStackedMobileBarChart,
  transposedMobileBarChart: createTransposedMobileBarChart,
  mobileBarChartHighlight: createMobileBarChartHighlight,
  columnChartAllTime: createColumnChartAllYears,
  columnChartAllCat: createColumnChartAllCategories,
  barChartAll: createBarChartAll,
  barChartAllTime: createBarChartAllYears,
  barChartAllCat: createBarChartAllCategories,
  stackedBarChartAll: createStackedBarAll
};
