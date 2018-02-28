const array2d = require("array2d");

const years = [
  "2004",
  "2005",
  "2006",
  "2007",
  "2008",
  "2009",
  "2010",
  "2011",
  "2012",
  "2013",
  "2014",
  "2015",
  "2016",
  "2017",
  "2018"
];

const categories = [
  "Land A Unglaublich langer Ländername",
  "Land Ä Unglaublich langer Ländername",
  "Land B",
  "Unglaublich langer Ländername C - nicht gut für mobile",
  "Land D",
  "Land E",
  "Land F",
  "Land G",
  "Land H",
  "Land I",
  "Land J",
  "Land K",
  "Land L Land L Land L",
  "Land M",
  "Land N",
  "Land O",
  "Land P Land P Land P Land P Land P Land P",
  "Land Q",
  "Land R",
  "Land S",
  "Land T",
  "Land U"
];

const minValue = 0;
const maxValue = 10000;

function getMonthlyDataSeries(yearsPortion, categoriesPortion) {
  let data = [["Month"]];
  // insert categories
  categoriesPortion.forEach(category => {
    data[0].push(category);
  });
  // for each year create an entry per month with number categories random values
  yearsPortion.forEach((year, index) => {
    for (var i = 1; i <= 12; i++) {
      // date format M-YYYY
      let date = `${i}-${year}`;
      let entry = [date];

      for (var j = 0; j < categoriesPortion.length; j++) {
        entry.push(
          "" +
            (Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue)
        );
      }
      data.push(entry);
    }
  });
  return data;
}

function getYearlyDataSeries(yearsPortion, categoriesPortion) {
  let data = [["Year"]];
  // insert categories
  categoriesPortion.forEach(category => {
    data[0].push(category);
  });
  // for each year create an entry with number categories values
  yearsPortion.forEach((year, index) => {
    data.push([year]);
    categoriesPortion.forEach(category => {
      data[index + 1].push(
        "" + (Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue)
      );
    });
  });
  return data;
}

// can be changed to monthly as well, does not make so much sense for columns/bars
function getCategoricalDataSeries(yearsPortion, categoriesPortion) {
  let data = getYearlyDataSeries(yearsPortion, categoriesPortion);
  return array2d.transpose(data);
}

function createBasicLineChart(numberOfCategories = 1) {
  let item = {
    title: "FIXTURE: line chart basic",
    subtitle: "some subtitle here",
    data: getMonthlyDataSeries(
      years.slice(years.length - 3),
      categories.slice(0, numberOfCategories)
    ), // last 3 of years array, first 4 of categories array
    sources: [
      {
        link: {},
        text: "Bloomberg"
      }
    ],
    options: {
      chartType: "Line",
      hideAxisLabel: false,
      barOptions: {
        isBarChart: false,
        forceBarsOnSmall: false
      },
      dateSeriesOptions: {
        interval: "month",
        prognosisStart: null
      },
      lineChartOptions: {},
      colorOverwrite: [],
      highlightDataSeries: null
    }
  };
  return item;
}

function createLineChartAllCategories() {
  let item = {
    title: "FIXTURE: line chart all categories",
    subtitle: "some subtitle here",
    data: getMonthlyDataSeries(years.slice(years.length - 3), categories), // last 3 of years array, all arrays
    sources: [
      {
        link: {},
        text: "Bloomberg"
      }
    ],
    options: {
      chartType: "Line",
      hideAxisLabel: false,
      barOptions: {
        isBarChart: false,
        forceBarsOnSmall: false
      },
      dateSeriesOptions: {
        interval: "month",
        prognosisStart: null
      },
      lineChartOptions: {},
      colorOverwrite: [],
      highlightDataSeries: null
    }
  };
  return item;
}

function createBasicColumnChart() {
  let item = {
    title: "FIXTURE: column chart basic",
    subtitle: "some subtitle here",
    data: getCategoricalDataSeries(
      years.slice(years.length - 3),
      categories.slice(0, 4)
    ), // 3 years, subset of 4 categories
    options: {
      chartType: "Bar",
      hideAxisLabel: false,
      barOptions: {
        isBarChart: false,
        forceBarsOnSmall: false
      },
      dateSeriesOptions: {
        interval: "year",
        prognosisStart: null
      },
      lineChartOptions: {},
      colorOverwrite: [],
      highlightDataSeries: null
    }
  };
  return item;
}

function createTransposedColumnChart() {
  let item = {
    title: "FIXTURE: column chart transposed",
    subtitle: "some subtitle here",
    data: getYearlyDataSeries(
      years.slice(years.length - 3),
      categories.slice(0, 4)
    ), // 3 years, subset of 4 categories
    options: {
      chartType: "Bar",
      hideAxisLabel: false,
      barOptions: {
        isBarChart: false,
        forceBarsOnSmall: false
      },
      dateSeriesOptions: {
        interval: "year",
        prognosisStart: null
      },
      lineChartOptions: {},
      colorOverwrite: [],
      highlightDataSeries: null
    }
  };
  return item;
}

function createColumnChartAll() {
  let item = {
    title: "FIXTURE: column chart all years, all categories",
    subtitle: "some subtitle here",
    data: getCategoricalDataSeries(years, categories), // all predefined years and categories
    options: {
      chartType: "Bar",
      hideAxisLabel: false,
      barOptions: {
        isBarChart: false,
        forceBarsOnSmall: false
      },
      dateSeriesOptions: {
        interval: "year",
        prognosisStart: null
      },
      lineChartOptions: {},
      colorOverwrite: [],
      highlightDataSeries: null
    }
  };
  return item;
}

function createColumnChartAllYears() {
  let item = {
    title: "FIXTURE: column chart all years, few categories",
    subtitle: "some subtitle here",
    data: getCategoricalDataSeries(years, categories.slice(0, 2)), // all years, subset of 2 categories
    options: {
      chartType: "Bar",
      hideAxisLabel: false,
      barOptions: {
        isBarChart: false,
        forceBarsOnSmall: false
      },
      dateSeriesOptions: {
        interval: "year",
        prognosisStart: null
      },
      lineChartOptions: {},
      colorOverwrite: [],
      highlightDataSeries: null
    }
  };
  return item;
}

function createColumnChartAllCategories() {
  let item = {
    title: "FIXTURE: column chart one year, all categories",
    subtitle: "some subtitle here",
    data: getCategoricalDataSeries(years.slice(years.length - 1), categories), // one year, all categories
    options: {
      chartType: "Bar",
      hideAxisLabel: false,
      barOptions: {
        isBarChart: false,
        forceBarsOnSmall: false
      },
      dateSeriesOptions: {
        interval: "year",
        prognosisStart: null
      },
      lineChartOptions: {},
      colorOverwrite: [],
      highlightDataSeries: null
    }
  };
  return item;
}

function createLineChartPrognosis() {
  let item = createBasicLineChart();
  item.title = "FIXTURE: line chart prognosis";
  const prognosisRange = Math.floor(item.data.length / 3);
  item.options.dateSeriesOptions.prognosisStart =
    item.data.length - prognosisRange;
  return item;
}

function createLineChartHighlight() {
  let item = createBasicLineChart(3);
  item.title = "FIXTURE: line chart highlight second";
  item.options.highlightDataSeries = 1;
  return item;
}

function createLineChartCustomColors() {
  let item = createBasicLineChart(3);
  item.title = "FIXTURE: line chart custom colors";
  item.options.colorOverwrite = [
    {
      color: "green",
      colorBright: "lightgreen",
      position: 1
    },
    {
      color: "red",
      colorBright: "orange",
      position: 2
    }
  ];

  return item;
}

function createLineChartMinMax() {
  let item = createBasicLineChart(3);
  item.title = "FIXTURE: line chart min max axis";
  item.options.lineChartOptions.minValue = 10000;
  item.options.lineChartOptions.maxValue = 80000;
  return item;
}

function createMobileBarChart() {
  let item = createBasicColumnChart();
  item.title = "FIXTURE: bar chart mobile";
  item.options.barOptions.forceBarsOnSmall = true;
  return item;
}

function createBarChart() {
  let item = createBasicColumnChart();
  item.title = "FIXTURE: bar chart basic";
  item.options.barOptions.isBarChart = true;
  return item;
}

function createStackedMobileBarChart() {
  let item = createBasicColumnChart();
  item.title = "FIXTURE: stacked column/bar mobile chart";
  item.options.chartType = "StackedBar";
  item.options.barOptions.forceBarsOnSmall = true;
  return item;
}

function createTransposedMobileBarChart() {
  let item = createTransposedColumnChart();
  item.title = "FIXTURE: transposed bar mobile chart";
  item.options.barOptions.forceBarsOnSmall = true;
  return item;
}

function createMobileBarChartHighlight() {
  let item = createBasicColumnChart();
  item.title = "FIXTURE: bar mobile chart hightlight second";
  item.options.barOptions.forceBarsOnSmall = true;
  item.options.highlightDataSeries = 1;
  return item;
}

function createBarChartAll() {
  let item = createColumnChartAll();
  item.title = "FIXTURE: large bar chart with all years, all categories";
  item.options.barOptions.isBarChart = true;
  return item;
}

function createBarChartAllYears() {
  let item = createColumnChartAllYears();
  item.title = "FIXTURE: bar chart all years, few categories";
  item.options.barOptions.isBarChart = true;
  return item;
}

function createBarChartAllCategories() {
  let item = createColumnChartAllCategories();
  item.title = "FIXTURE: bar chart one year, all categories";
  item.options.barOptions.isBarChart = true;
  return item;
}

function createStackedBarAll() {
  let item = createColumnChartAll();
  item.title = "FIXTURE: stacked bar chart all years, all categories";
  item.options.chartType = "StackedBar";
  return item;
}

const vegaSpecFixtures = [
  {
    vegaSpec: {
      $schema: "https://vega.github.io/schema/vega/v3.0.json",
      data: [
        {
          name: "original-data",
          values: [
            [
              "Kreise",
              "Corine Mauch",
              "Daniel Leupi",
              "André Odermatt",
              "Claudia Nielsen",
              "Richard Wolff",
              "Filippo Leutenegger",
              "Raphael Golta",
              "Michael Baumer",
              "Karin Rykart",
              "Markus Hungerbühler",
              "Susanne Brunner",
              "Roger Bartholdi",
              "Andreas Hauri",
              "Claudia Rabelbauer"
            ],
            [
              "1+2",
              "10",
              "10",
              "10",
              "10",
              "10",
              "10",
              "10",
              "10",
              "10",
              "10",
              "10",
              "10",
              "10",
              "10"
            ],
            [
              "3",
              "20",
              "20",
              "20",
              "20",
              "20",
              "20",
              "20",
              "20",
              "20",
              "20",
              "20",
              "20",
              "20",
              "20"
            ],
            [
              "4+5",
              "30",
              "30",
              "30",
              "30",
              "30",
              "30",
              "40",
              "10",
              "90",
              "30",
              "30",
              "30",
              "30",
              "30"
            ],
            [
              "6",
              "50",
              "50",
              "50",
              "50",
              "50",
              "50",
              "50",
              "50",
              "50",
              "50",
              "50",
              "50",
              "50",
              "50"
            ],
            [
              "7+8",
              "34",
              "34",
              "34",
              "34",
              "34",
              "34",
              "34",
              "34",
              "34",
              "34",
              "34",
              "34",
              "34",
              "34"
            ],
            [
              "9",
              "69",
              "69",
              "69",
              "69",
              "69",
              "69",
              "69",
              "69",
              "69",
              "40",
              "69",
              "69",
              "69",
              "69"
            ],
            [
              "10",
              "34",
              "34",
              "34",
              "34",
              "34",
              "34",
              "34",
              "34",
              "34",
              "34",
              "34",
              "34",
              "34",
              "34"
            ],
            [
              "11",
              "87",
              "87",
              "87",
              "87",
              "87",
              "87",
              "87",
              "87",
              "87",
              "87",
              "87",
              "87",
              "87",
              "87"
            ],
            [
              "12",
              "34",
              "34",
              "34",
              "34",
              "34",
              "34",
              "34",
              "34",
              "34",
              "34",
              "34",
              "34",
              "34",
              "34"
            ]
          ]
        },
        {
          name: "cross-table",
          transform: [
            {
              type: "sequence",
              start: 0,
              stop: {
                signal:
                  "max(data('original-data').length, data('original-data')[0].length)"
              }
            },
            { type: "cross", as: ["a", "b"] },
            { type: "identifier", as: "cellIndex" },
            {
              type: "filter",
              expr:
                "(datum.cellIndex - 1) % max(data('original-data').length, data('original-data')[0].length) < data('original-data')[0].length"
            },
            {
              type: "filter",
              expr:
                "(datum.cellIndex - 1) < data('original-data').length * max(data('original-data').length, data('original-data')[0].length)"
            },
            { type: "formula", expr: "datum.a.data", as: "row" },
            {
              type: "formula",
              expr:
                "(datum.cellIndex - 1 - (max(data('original-data').length, data('original-data')[0].length) - data('original-data')[0].length)*datum.row) % data('original-data')[0].length",
              as: "column"
            }
          ]
        },
        {
          name: "long-table-head",
          source: "cross-table",
          transform: [
            { type: "filter", expr: "datum.row === 0" },
            {
              type: "formula",
              expr: "data('original-data')[0][datum.column]",
              as: "value"
            },
            { type: "project", fields: ["column", "value"] }
          ]
        },
        {
          name: "long-table",
          source: "cross-table",
          transform: [
            { type: "filter", expr: "datum.row > 0 && datum.column > 0" },
            { type: "formula", expr: "datum.column - 1", as: "cIndex" },
            {
              type: "formula",
              expr: "data('long-table-head')[datum.column].value",
              as: "cValue"
            },
            { type: "formula", expr: "datum.row - 1", as: "xIndex" },
            {
              type: "formula",
              expr: "data('original-data')[datum.row][0]",
              as: "xValue"
            },
            {
              type: "formula",
              expr:
                "toNumber(replace(data('original-data')[datum.row][datum.column], ',', '.'))",
              as: "yValue"
            },
            {
              type: "project",
              fields: [
                "row",
                "column",
                "xIndex",
                "xValue",
                "yValue",
                "cValue",
                "cIndex"
              ]
            },
            { type: "extent", field: "yValue", signal: "yExtent" },
            { type: "extent", field: "column", signal: "columnExtent" },
            { type: "extent", field: "row", signal: "rowExtent" }
          ]
        },
        {
          name: "table",
          source: "long-table",
          transform: [
            {
              type: "formula",
              expr:
                "((datum.cIndex - datum.cIndex % sue___columns) / sue___columns)",
              as: "cellRow"
            },
            {
              type: "formula",
              expr: "datum.cIndex % sue___columns",
              as: "cellColumn"
            },
            {
              type: "stack",
              groupby: {
                signal:
                  "sue___smallMultiples ? ['cIndex','xValue'] : ['xValue']"
              },
              sort: { field: "cValue" },
              field: "yValue"
            }
          ]
        },
        {
          name: "prognosis",
          source: "table",
          transform: [
            {
              type: "filter",
              expr: "showPrognosis && datum.xValue >= prognosisStart"
            },
            {
              type: "aggregate",
              groupby: ["xValue"],
              fields: ["y1"],
              ops: ["max"],
              as: ["barHeight"]
            },
            { type: "extent", field: "barHeight", signal: "barHeightExtents" }
          ]
        }
      ],
      signals: [
        { name: "sue___autoHeight", value: true, bind: { input: "checkbox" } },
        {
          name: "maxBarWidth",
          value: 10.68,
          bind: { input: "range", min: 0, max: 300 }
        },
        { name: "patternSize", value: 8 },
        {
          name: "patternRepeatsPerRow",
          update: "ceil(maxBarWidth / patternSize)"
        },
        { name: "showPrognosis", value: false, bind: { input: "checkbox" } },
        { name: "prognosisStart", value: 5, bind: { input: "number" } },
        {
          name: "sue___smallMultiples",
          value: true,
          bind: { input: "checkbox" }
        },
        { name: "sue___titleHeight", value: 25 },
        {
          name: "sue___paddingRatio",
          value: 0.12,
          bind: { input: "number", step: 0.01, min: 0, max: 0.25 }
        },
        { name: "sue___heightPerRow", value: 200, bind: { input: "number" } },
        {
          name: "sue___rowPadding",
          update: "floor(sue___minTileWidth * sue___paddingRatio)"
        },
        {
          name: "sue___columnPadding",
          update: "floor(sue___minTileWidth * sue___paddingRatio)"
        },
        {
          name: "sue___computedHeight",
          update:
            "sue___autoHeight && sue___rows * sue___heightPerRow + (sue___rows - 1) * sue___rowPadding"
        },
        { name: "sue___minTileWidth", value: 220, bind: { input: "number" } },
        { name: "sue___minColumns", value: 1, bind: { input: "number" } },
        {
          name: "sue___columns",
          update:
            "sue___smallMultiples !== true ? 1 : max(sue___minColumns, floor(width / sue___minTileWidth))"
        },
        {
          name: "sue___cellWidth",
          update:
            "sue___smallMultiples !== true ? width : floor((width - (sue___columns - 1)  * sue___columnPadding) / sue___columns)"
        },
        {
          name: "sue___rows",
          update: "max(1, ceil(columnExtent[1] / sue___columns))"
        },
        {
          name: "sue___cellHeight",
          update: "sue___autoHeight ? sue___heightPerRow : height / sue___rows"
        }
      ],
      scales: [
        { name: "cScale", type: "ordinal", range: "category" },
        {
          name: "binaryColorScale",
          type: "ordinal",
          range: ["#b23c39", "#5e6192"],
          domain: ["no", "yes"]
        }
      ],
      marks: [
        {
          type: "group",
          name: "wrapper-group",
          encode: {
            update: {
              width: { signal: "width" },
              height: { signal: "sue___computedHeight || height" }
            }
          },
          marks: [
            {
              name: "row-group",
              type: "group",
              from: {
                facet: { name: "cellRow", data: "table", groupby: ["cellRow"] }
              },
              signals: [{ name: "height", update: "sue___cellHeight" }],
              encode: {
                update: {
                  width: { signal: "width" },
                  height: { signal: "sue___cellHeight" }
                }
              },
              scales: [
                {
                  name: "yScale",
                  type: "linear",
                  range: "height",
                  nice: true,
                  zero: true,
                  padding: 0.4,
                  domain: { data: "table", field: "y1" }
                }
              ],
              axes: [
                {
                  orient: "left",
                  scale: "yScale",
                  domain: false,
                  ticks: false,
                  grid: false,
                  labels: true
                }
              ],
              layout: {
                offset: 0,
                columns: { signal: "sue___columns" },
                align: "none",
                bounds: "full",
                padding: { row: 0, column: { signal: "sue___columnPadding" } },
                headerBand: { row: 0, column: 0 },
                footerBand: { row: 0, column: 0 },
                titleBand: { row: 0, column: 0 }
              },
              marks: [
                {
                  name: "cell-group",
                  type: "group",
                  from: {
                    facet: {
                      name: "cell",
                      data: "cellRow",
                      groupby: ["cIndex", "cValue"]
                    }
                  },
                  signals: [{ name: "width", update: "sue___cellWidth" }],
                  encode: {
                    update: { height: { signal: "sue___cellHeight" } }
                  },
                  scales: [
                    {
                      name: "xScale",
                      type: "band",
                      range: "width",
                      padding: 0.1,
                      domain: { data: "table", field: "xValue" }
                    }
                  ],
                  axes: [
                    {
                      orient: "bottom",
                      scale: "xScale",
                      domain: false,
                      grid: false,
                      labels: true
                    },
                    {
                      orient: "left",
                      scale: "yScale",
                      domain: false,
                      ticks: false,
                      grid: true,
                      labels: false,
                      maxExtent: 0,
                      minExtent: 0
                    }
                  ],
                  marks: [
                    {
                      type: "rect",
                      from: { data: "cell" },
                      encode: {
                        enter: {
                          xc: {
                            signal:
                              "scale('xScale', datum.xValue) + bandwidth('xScale')/2"
                          },
                          width: {
                            signal: "min(bandwidth('xScale'), maxBarWidth)"
                          },
                          y: { scale: "yScale", field: "y0" },
                          y2: { scale: "yScale", field: "y1" },
                          fill: {
                            scale: "cScale",
                            signal: "sue___smallMultiples ? 0 : datum.cIndex"
                          }
                        }
                      }
                    },
                    {
                      type: "group",
                      from: { data: "prognosis" },
                      encode: {
                        update: {
                          clip: { value: true },
                          xc: {
                            signal:
                              "scale('xScale', datum.xValue) + bandwidth('xScale')/2"
                          },
                          width: {
                            signal: "min(bandwidth('xScale'), maxBarWidth)"
                          },
                          y: { scale: "yScale", field: "barHeight" },
                          y2: { scale: "yScale", value: 0 },
                          opacity: { value: 1 }
                        }
                      },
                      signals: [
                        {
                          name: "numPatternRepetitions",
                          update:
                            "scale('yScale', barHeightExtents[1] - parent.barHeight) / patternSize * patternRepeatsPerRow"
                        }
                      ],
                      marks: [
                        {
                          type: "group",
                          data: [
                            {
                              name: "iterator",
                              values: [],
                              transform: [
                                {
                                  type: "sequence",
                                  start: 0,
                                  stop: { signal: "numPatternRepetitions" }
                                }
                              ]
                            }
                          ],
                          marks: [
                            {
                              type: "symbol",
                              from: { data: "iterator" },
                              encode: {
                                update: {
                                  stroke: { value: "#FFFFFF" },
                                  strokeOpacity: { value: 0.5 },
                                  x: {
                                    signal:
                                      "datum.data % patternRepeatsPerRow * patternSize"
                                  },
                                  y: {
                                    signal:
                                      "((datum.data - datum.data % patternRepeatsPerRow) / patternRepeatsPerRow) * patternSize"
                                  },
                                  shape: {
                                    signal:
                                      "'M0,' + (patternSize / 4) + ' l' + (patternSize / 4)  + ',-' + (patternSize / 4)"
                                  }
                                }
                              }
                            }
                          ]
                        }
                      ]
                    },
                    {
                      name: "title-group",
                      type: "group",
                      from: {
                        facet: {
                          name: "titles",
                          data: "cell",
                          groupby: "cValue"
                        }
                      },
                      encode: {
                        update: {
                          width: { signal: "sue___cellWidth" },
                          height: { signal: "sue___titleHeight" },
                          y: { signal: "-sue___titleHeight" }
                        }
                      },
                      marks: [
                        {
                          type: "text",
                          encode: {
                            update: {
                              x: { signal: "sue___cellWidth/2" },
                              y: { signal: "sue___titleHeight / 2" },
                              baseline: { value: "middle" },
                              align: { value: "center" },
                              text: { signal: "parent.cValue" }
                            }
                          }
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ],
          layout: {
            offset: 0,
            columns: 1,
            align: "none",
            bounds: "full",
            padding: { column: 0, row: { signal: "sue___rowPadding" } },
            headerBand: { row: 0, column: 0 },
            footerBand: { row: 0, column: 0 },
            titleBand: { row: 0, column: 0 }
          },
          axes: []
        }
      ],
      autosize: { type: "fit-x" },
      layout: {
        offset: 0,
        columns: 1,
        align: "none",
        bounds: "full",
        padding: 0,
        headerBand: { row: 0, column: 0 },
        footerBand: { row: 0, column: 0 },
        titleBand: { row: 0, column: 0 }
      }
    },
    data: [
      [
        "Kreise",
        "Roger Bartholdi",
        "Michael Baumer",
        "Susanne Brunner",
        "Raphael Golta",
        "Markus Hungerbühler",
        "Andreas Hauri",
        "Daniel Leupi",
        "Filippo Leutenegger",
        "Corine Mauch",
        "André Odermatt",
        "Claudia Rabelbauer",
        "Karin Rykart",
        "Richard Wolff"
      ],
      [
        "1+2",
        "10",
        "10",
        "10",
        "10",
        "10",
        "10",
        "10",
        "10",
        "10",
        "10",
        "10",
        "10",
        "10"
      ],
      [
        "3",
        "20",
        "20",
        "20",
        "20",
        "20",
        "20",
        "20",
        "20",
        "20",
        "20",
        "20",
        "20",
        "20"
      ],
      [
        "4+5",
        "30",
        "10",
        "30",
        "40",
        "30",
        "30",
        "30",
        "30",
        "30",
        "30",
        "30",
        "90",
        "30"
      ],
      [
        "6",
        "50",
        "50",
        "50",
        "50",
        "50",
        "50",
        "50",
        "50",
        "50",
        "50",
        "50",
        "50",
        "50"
      ],
      [
        "7+8",
        "34",
        "34",
        "34",
        "34",
        "34",
        "34",
        "34",
        "34",
        "34",
        "34",
        "34",
        "34",
        "34"
      ],
      [
        "9",
        "69",
        "69",
        "69",
        "69",
        "40",
        "69",
        "69",
        "69",
        "69",
        "69",
        "69",
        "69",
        "69"
      ],
      [
        "10",
        "34",
        "34",
        "34",
        "34",
        "34",
        "34",
        "34",
        "34",
        "34",
        "34",
        "34",
        "34",
        "34"
      ],
      [
        "11",
        "87",
        "87",
        "87",
        "87",
        "87",
        "87",
        "87",
        "87",
        "87",
        "87",
        "87",
        "87",
        "87"
      ],
      [
        "12",
        "34",
        "34",
        "34",
        "34",
        "34",
        "34",
        "34",
        "34",
        "34",
        "34",
        "34",
        "34",
        "34"
      ]
    ],
    options: {
      chartType: "Bar",
      hideAxisLabel: false,
      barOptions: {
        isBarChart: false,
        forceBarsOnSmall: false
      },
      dateSeriesOptions: {
        interval: "year",
        prognosisStart: null
      },
      lineChartOptions: {
        reverseYScale: false,
        lineInterpolation: "linear"
      },
      colorOverwrite: [],
      highlightDataSeries: null
    }
  }
];
function createVegaSpec() {
  let item = vegaSpecFixtures[0];
  item.title = "FIXTURE: custom vegaSpec";
  item.subtitle = "subtitle";
  item.options = {};
  return item;
}

module.exports = {
  basicLineChart: createBasicLineChart,
  lineChartAllCategories: createLineChartAllCategories,
  lineChartPrognosis: createLineChartPrognosis,
  lineChartHighlight: createLineChartHighlight,
  lineChartCustomColors: createLineChartCustomColors,
  lineChartMinMax: createLineChartMinMax,
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
  stackedBarChartAll: createStackedBarAll,
  vegaSpec: createVegaSpec
};
