const objectPath = require("object-path");
const clone = require("clone");
const intervals = require("../helpers/dateSeries.js").intervals;
const dateSeries = require("../helpers/dateSeries.js");

const d3 = {
  timeFormat: require("d3-time-format").timeFormat
};

const textMeasure = require("../helpers/textMeasure.js");
const dataHelpers = require("../helpers/data.js");

function getLineDateSeriesHandlingMappings() {
  return [
    {
      path: "item.data", // various settings that are not tied to an option
      mapToSpec: function(itemData, spec, mappingData) {
        const item = mappingData.item;
        if (
          (mappingData.dateFormat &&
            (item.options.chartType === "Line" &&
              item.options.lineChartOptions &&
              item.options.lineChartOptions.isStockChart !== true)) ||
          item.options.chartType === "Area"
        ) {
          objectPath.set(spec, "scales.0.type", "time"); // time scale type: https://vega.github.io/vega/docs/scales/#time
          objectPath.set(spec, "axes.0.ticks", true); // show ticks if we have a date series
        }
      }
    },
    {
      path: "item.options.dateSeriesOptions.interval",
      mapToSpec: function(interval, spec, mappingData) {
        // only use this option if we have a valid dateFormat
        // if so, the scale type is set to time by now so we can check this
        if (spec.scales[0].type === "time") {
          objectPath.set(spec, "axes.0.encode.labels.update.text", {
            signal: `formatDateForInterval(datum.value, '${interval}')`
          });
        }
      }
    },
    {
      path: "item.options.dateSeriesOptions.labels",
      mapToSpec: function(labels, spec, mappingData) {
        const interval = mappingData.item.options.dateSeriesOptions.interval;
        if (!interval) {
          return;
        }
        // few means we only draw first an last values of the domain
        if (labels === "few") {
          const { first, last } = dateSeries.getFirstAndLastDateFromData(
            mappingData.item.data
          );

          const intervalConfig = dateSeries.intervals[interval];
          const firstValue = intervalConfig.getFirstStepDateAfterDate(first);
          const lastValue = intervalConfig.getLastStepDateBeforeDate(last);

          // set the values explicitly to the first and last value
          objectPath.set(spec, "axes.0.values", [
            firstValue.valueOf(), // we need to set timestamps here because the values array doesn't like objects (Date)
            lastValue.valueOf() // they will be sent through d3-time-format in the end, which recognises the timestamps and does the correct thing.
          ]);

          // setting labelBound to false is just for security, the following positioning logic should make sure the label never spans outside the axis
          // in any case if the logic has a flaw, we set the labelBound to false to not hide the label in these cases
          objectPath.set(spec, "axes.0.labelBound", false);

          if (!objectPath.get(spec, "axes.0.encode.labels.update.align")) {
            objectPath.set(spec, "axes.0.encode.labels.update.align", [
              {
                // value - minValue < maxValue - value (is the value on the left side of the axis)
                // &&
                // valueLabelWidth / 2 > posOfTickValue - leftSideOfAxis (would the label span outside the axis on the left side)
                test: `(datum.value - utcFormat(extent(domain('xScale'))[0], '%Q') < utcFormat(extent(domain('xScale'))[1], '%Q') - datum.value) && measureAxisLabelWidth(formatDateForInterval(datum.value, '${interval}')) / 2 > (scale('xScale', datum.value) - scale('xScale', extent(domain('xScale'))[0]))`,
                value: "left"
              },
              {
                // value - minValue > maxValue - value (is the value on the right side of the axis)
                // &&
                // valueLabelWidth / 2 > rightSideOfAxis - posOfTickValue (would the label span outside the axis on the right side)
                test: `(datum.value - utcFormat(extent(domain('xScale'))[0], '%Q') > utcFormat(extent(domain('xScale'))[1], '%Q') - datum.value) && measureAxisLabelWidth(formatDateForInterval(datum.value, '${interval}')) / 2 > (scale('xScale', extent(domain('xScale'))[1]) - scale('xScale', datum.value))`,
                value: "right"
              },
              {
                value: "center"
              }
            ]);
          }
        } else if (labels === "many" || !labels) {
          // also run undefined labels option through this to not change the previous behaviour
          // do nothing, this case is already handled with the interval option
          if (intervals[interval].ticks instanceof Function) {
            objectPath.set(
              spec,
              "axes.0.values",
              intervals[interval]
                .ticks(mappingData.item.data)
                .map(d => d.valueOf())
            );
          } else {
            objectPath.set(
              spec,
              "axes.0.tickCount",
              intervals[interval].vegaInterval
            );
          }
        }
      }
    }
  ];
}

function getColumnDateSeriesHandlingMappings() {
  return [
    {
      path: "item.options.dateSeriesOptions.interval",
      mapToSpec: function(interval, spec, mappingData) {
        if (mappingData.dateFormat) {
          objectPath.set(spec, "axes.0.encode.labels.update.text", {
            signal: `formatDateForInterval(datum.value, '${interval}')`
          });
          objectPath.set(spec, "axes.0.labelOverlap", "parity"); // use parity label overlap strategy if we have a date series
        }
      }
    }
  ];
}

function getBarDateSeriesHandlingMappings() {
  return [
    {
      path: "item.options.dateSeriesOptions.interval",
      mapToSpec: function(interval, spec, mappingData) {
        if (mappingData.dateFormat) {
          objectPath.set(spec, "axes.1.encode.labels.update.text", {
            signal: `formatDateForInterval(datum.value, '${interval}')`
          });
          objectPath.set(spec, "axes.1.labelOverlap", "parity"); // use parity label overlap strategy if we have a date series
        }
      }
    }
  ];
}

function getColumnAreaPrognosisMappings() {
  return [
    {
      path: "item.options.dateSeriesOptions.prognosisStart",
      mapToSpec: function(prognosisStart, spec, mappingData, id) {
        if (!Number.isInteger(prognosisStart)) {
          return;
        }
        // add the signal
        objectPath.push(spec, "signals", {
          name: "prognosisStartDate",
          value: dateSeries.getPrognosisStartDate(
            mappingData.originalItemData,
            prognosisStart
          )
        });

        // add the data for prognosis
        objectPath.push(spec, "data", {
          name: "prognosis",
          source: "table",
          transform: [
            {
              type: "filter",
              expr:
                "timeFormat(datum.xValue, '%Q') >= timeFormat(prognosisStartDate, '%Q')"
            }
          ]
        });

        const prognosisMarks = clone(spec.marks[0]);
        prognosisMarks.name = "prognosisArea";
        if (prognosisMarks.from.facet) {
          prognosisMarks.from.facet.data = "prognosis";
        } else {
          prognosisMarks.from.data = "prognosis";
        }
        if (prognosisMarks.marks) {
          prognosisMarks.marks[0].encode.enter.fill = {
            value: `url(#prognosisPattern${id})`
          };
        } else {
          prognosisMarks.encode.enter.fill = {
            value: `url(#prognosisPattern${id})`
          };
        }

        objectPath.push(spec, "marks", prognosisMarks);
      }
    }
  ];
}

function getBarPrognosisMappings() {
  return [
    {
      path: "item.options.dateSeriesOptions.prognosisStart",
      mapToSpec: function(prognosisStart, spec, mappingData, id) {
        if (!Number.isInteger(prognosisStart)) {
          return;
        }
        // add the signal
        objectPath.push(spec, "signals", {
          name: "prognosisStartDate",
          value: dateSeries.getPrognosisStartDate(
            mappingData.originalItemData,
            prognosisStart
          )
        });

        // add the data for prognosis
        objectPath.push(spec, "data", {
          name: "prognosis",
          source: "table",
          transform: [
            {
              type: "filter",
              expr:
                "timeFormat(datum.xValue, '%Q') >= timeFormat(prognosisStartDate, '%Q')"
            }
          ]
        });

        const prognosisMarks = clone(spec.marks[0]);
        prognosisMarks.name = "prognosisBlocks";
        prognosisMarks.from.facet.data = "prognosis";

        prognosisMarks.marks[0].marks[0].encode.enter.fill = {
          value: `url(#prognosisPattern${id})`
        };

        // take only the first rect mark
        prognosisMarks.marks[0].marks = [
          prognosisMarks.marks[0].marks.find(mark => mark.type === "rect")
        ];

        prognosisMarks.marks[0].marks[0].name = "prognosisBar";

        spec.marks.push(prognosisMarks);
      }
    }
  ];
}

function getColumnLabelColorMappings() {
  return [
    {
      path: "item.data",
      mapToSpec: function(itemData, spec) {
        if (!spec.config.axis.labelColorDark) {
          return;
        }
        objectPath.set(
          spec,
          "axes.0.encode.labels.update.fill.value",
          spec.config.axis.labelColorDark
        ); // use the dark color for categorical bar/column labels
      }
    }
  ];
}

function getBarLabelColorMappings() {
  return [
    {
      path: "data",
      mapToSpec: function(itemData, spec) {
        if (!spec.config.axis.labelColorDark) {
          return;
        }
        objectPath.set(
          spec,
          "axes.1.encode.labels.update.fill.value",
          spec.config.axis.labelColorDark
        ); // use the dark color for categorical bar/column labels
      }
    }
  ];
}

function getHeightMappings() {
  return [
    {
      path: "toolRuntimeConfig.displayOptions.size",
      mapToSpec: function(size, spec, mappingData) {
        let aspectRatio;
        if (size === "prominent") {
          aspectRatio = 9 / 16;
        } else {
          aspectRatio = 3 / 7;
        }
        let height = spec.width * aspectRatio;

        // minimum height is 240px
        if (height < Math.min(240, spec.width)) {
          height = Math.min(240, spec.width);
        }
        // increase the height if hideAxisLabel option is unchecked
        if (mappingData.item.options.hideAxisLabel === false) {
          height = height + 20;
        }
        objectPath.set(spec, "height", height);
      }
    }
  ];
}

function getHighlightRowsMapping() {
  return [
    {
      path: "item.options.highlightDataRows",
      mapToSpec: function(highlightDataRows, spec) {
        if (
          !Array.isArray(highlightDataRows) ||
          highlightDataRows.length === 0
        ) {
          return;
        }
        spec.data[0].values.map(value => {
          if (highlightDataRows.includes(value.xIndex)) {
            value.isHighlighted = true;
          } else {
            value.isHighlighted = false;
          }
        });
      }
    }
  ];
}

function getHighlightSeriesMapping() {
  return [
    {
      path: "item.options.highlightDataSeries",
      mapToSpec: function(highlightDataSeries, spec) {
        if (
          !Array.isArray(highlightDataSeries) ||
          highlightDataSeries.length === 0
        ) {
          return;
        }
        spec.data[0].values.map(value => {
          // if isHighlighted is already set to false, we return here
          // highlight rows and highlight columns are in an AND relationship to result in a highlighted column
          if (value.isHighlighted === false) {
            return;
          }
          if (highlightDataSeries.includes(value.cValue)) {
            value.isHighlighted = true;
          } else {
            value.isHighlighted = false;
          }
        });

        // put the highlighted elements to the end, they should be drawn last in the svg
        spec.data[0].values = spec.data[0].values.sort((a, b) => {
          if (a.isHighlighted && !b.isHighlighted) {
            return 1;
          }
          if (!a.isHighlighted && b.isHighlighted) {
            return -1;
          }
          return 0;
        });
      }
    }
  ];
}

function getColorOverwritesRowsMappings() {
  return [
    {
      path: "item.options.colorOverwritesRows",
      mapToSpec: function(colorOverwritesRows, spec, mappingData) {
        // do not handle colorOverwriteRows if we have more than two dataseries.
        if (mappingData.item.data[0].length > 3) {
          return;
        }
        for (const colorOverwrite of colorOverwritesRows) {
          //   // if we do not have a valid color or position, ignore this
          if (!colorOverwrite.color || Number.isNaN(colorOverwrite.position)) {
            continue;
          }
          spec.data[0].values.map(value => {
            if (value.xIndex === colorOverwrite.position - 1) {
              value.color = colorOverwrite.color;
              if (colorOverwrite.colorLight) {
                value.colorLight = colorOverwrite.colorLight;
              }
            }
          });
        }
      }
    }
  ];
}

function getColumnAxisPositioningMappings() {
  return [
    {
      path: "item.data",
      mapToSpec: function(data, spec, mappingData) {
        // if we have positive and negative values, we want a 0 baseline to be included
        const max = dataHelpers.getMaxValue(data);

        // if we have only negative values
        // we move the X axis to the top
        if (max <= 0) {
          objectPath.set(spec, "axes.0.orient", "top");
          objectPath.set(spec, "axes.0.labelPadding", 4);
          // if we still have a title for this axis, move it to the top
          const title = objectPath.get(spec, "axes.0.encode.title");
          if (title) {
            objectPath.set(
              spec,
              "axes.0.encode.title.update.baseline.value",
              "bottom"
            );
            objectPath.set(spec, "axes.0.encode.title.update.y.value", -30);
          }
        }
      }
    }
  ];
}

function getBarAxisPositioningMappings() {
  return [
    {
      path: "item.data",
      mapToSpec: function(data, spec, mappingData) {
        // if we have positive and negative values, we want a 0 baseline to be included
        const max = dataHelpers.getMaxValue(data);

        // if we have only negative values
        // we move the X axis to the top
        if (max <= 0) {
          objectPath.set(spec, "axes.1.orient", "right");
          // if we still have a title for this axis, move it to the top
          const title = objectPath.get(spec, "axes.1.encode.title");
          if (title) {
            objectPath.set(
              spec,
              "axes.1.encode.title.update.align.value",
              "left"
            );
          }
        }
      }
    }
  ];
}

module.exports = {
  getLineDateSeriesHandlingMappings,
  getColumnDateSeriesHandlingMappings,
  getBarDateSeriesHandlingMappings,
  getColumnAreaPrognosisMappings,
  getBarPrognosisMappings,
  getColumnLabelColorMappings,
  getBarLabelColorMappings,
  getHeightMappings,
  getHighlightRowsMapping,
  getHighlightSeriesMapping,
  getColorOverwritesRowsMappings,
  getColumnAxisPositioningMappings,
  getBarAxisPositioningMappings
};
