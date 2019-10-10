const objectPath = require("object-path");
const clone = require("clone");
const intervals = require("../helpers/dateSeries.js").intervals;
const d3 = {
  timeFormat: require("d3-time-format").timeFormat
};

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
        const item = mappingData.item;
        // only use this option if we have a valid dateFormat
        if (spec.scales[0].type === "time") {
          if (process.env.FEAT_VARIABLE_HOUR_STEP === true) {
            let step = 1;
            // if we have hour interval and potentially to many ticks (so they become messy because they do not map to pixels nicely)
            // use step: 2, otherwise step: 1 in tickCount
            if (interval === "hour") {
              const minDate = item.data[1][0];
              const maxDate = item.data[item.data.length - 1][0];
              const diffHours =
                Math.abs(maxDate.getTime() - minDate.getTime()) /
                1000 /
                60 /
                60;

              // todo: this should ideally take the label width into account but is hardcoded to 200 for now
              const thresholdHours = spec.width - 200;

              // we do not want more than a tick per 5 pixels
              if (maxDate > thresholdHours * 5) {
                step = 2;
              }
            }
            intervals[interval].vegaInterval.step = step;
          }

          objectPath.set(spec, "axes.0.format", intervals[interval].d3format);
          objectPath.set(
            spec,
            "axes.0.tickCount",
            intervals[interval].vegaInterval
          );
        }
      }
    }
  ];
}

function getColumnDateSeriesHandlingMappings() {
  return [
    {
      path: "item.data", // various settings that are not tied to an option
      mapToSpec: function(itemData, spec, mappingData) {
        const item = mappingData.item;
        if (mappingData.dateFormat) {
          const d3format =
            intervals[item.options.dateSeriesOptions.interval].d3format;

          // format the labels for the X axis according to the interval d3format
          spec.axes[0].encode = Object.assign({}, spec.axes[0].encode, {
            labels: {
              update: {
                text: {
                  signal: `timeFormat(datum.value, '${intervals[item.options.dateSeriesOptions.interval].d3format}')`
                }
              }
            }
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
      path: "item.data", // various settings that are not tied to an option
      mapToSpec: function(itemData, spec, mappingData) {
        const item = mappingData.item;
        if (mappingData.dateFormat) {
          const d3format =
            intervals[item.options.dateSeriesOptions.interval].d3format;

          // format the labels for the X axis according to the interval d3format
          spec.axes[1].encode = Object.assign({}, spec.axes[1].encode, {
            labels: {
              update: {
                text: {
                  signal: `timeFormat(datum.value, '${intervals[item.options.dateSeriesOptions.interval].d3format}')`
                }
              }
            }
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
        // add the signal with prognosisStart value
        objectPath.push(spec, "signals", {
          name: "prognosisStart",
          value: prognosisStart
        });

        // add the data for prognosis
        objectPath.push(spec, "data", {
          name: "prognosis",
          source: "table",
          transform: [
            {
              type: "filter",
              expr: "datum.xIndex >= prognosisStart"
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
        // add the signal with prognosisStart value
        objectPath.push(spec, "signals", {
          name: "prognosisStart",
          value: prognosisStart
        });

        // add the data for prognosis
        objectPath.push(spec, "data", {
          name: "prognosis",
          source: "table",
          transform: [
            {
              type: "filter",
              expr: "datum.xIndex >= prognosisStart"
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
