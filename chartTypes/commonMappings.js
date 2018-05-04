const objectPath = require("object-path");
const clone = require("clone");
const intervals = require("../helpers/dateSeries.js").intervals;
const d3 = {
  timeFormat: require("d3-time-format").timeFormat
};

function getLineDateSeriesHandlingMappings(config = {}) {
  return [
    {
      path: "data", // various settings that are not tied to an option
      mapToSpec: function(itemData, spec, item) {
        if (config.dateFormat && item.options.lineChartOptions && item.options.lineChartOptions.isStockChart === false) {
          objectPath.set(spec, "scales.0.type", "time"); // time scale type: https://vega.github.io/vega/docs/scales/#time
          objectPath.set(spec, "axes.0.labelOverlap", "parity"); // use parity label overlap strategy if we have a date series
          objectPath.set(spec, "axes.0.ticks", true); // show ticks if we have a date series
        }
      }
    },
    {
      path: "options.dateSeriesOptions.interval",
      mapToSpec: function(interval, spec, item) {
        // only use this option if we have a valid dateFormat
        if (spec.scales[0].type === 'time') {
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

function getColumnDateSeriesHandlingMappings(config = {}) {
  return [
    {
      path: "data", // various settings that are not tied to an option
      mapToSpec: function(itemData, spec, item) {
        if (config.dateFormat) {
          const d3format =
            intervals[item.options.dateSeriesOptions.interval].d3format;

          // format the labels for the X axis according to the interval d3format
          spec.axes[0].encode = Object.assign({}, spec.axes[0].encode, {
            labels: {
              update: {
                text: {
                  signal: `timeFormat(datum.value, '${
                    intervals[item.options.dateSeriesOptions.interval].d3format
                  }')`
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

function getBarDateSeriesHandlingMappings(config = {}) {
  return [
    {
      path: "data", // various settings that are not tied to an option
      mapToSpec: function(itemData, spec, item) {
        if (config.dateFormat) {
          const d3format =
            intervals[item.options.dateSeriesOptions.interval].d3format;

          // format the labels for the X axis according to the interval d3format
          spec.axes[1].encode = Object.assign({}, spec.axes[1].encode, {
            labels: {
              update: {
                text: {
                  signal: `timeFormat(datum.value, '${
                    intervals[item.options.dateSeriesOptions.interval].d3format
                  }')`
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

function getColumnPrognosisMappings(config) {
  return [
    {
      path: "options.dateSeriesOptions.prognosisStart",
      mapToSpec: function(prognosisStart, spec, item, id) {
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
        prognosisMarks.name = "prognosisColumn";
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

function getBarPrognosisMappings(config) {
  return [
    {
      path: "options.dateSeriesOptions.prognosisStart",
      mapToSpec: function(prognosisStart, spec, item, id) {
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

function getColumnLabelColorMappings(config) {
  return [
    {
      path: "data",
      mapToSpec: function(itemData, spec, item, id) {
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

function getBarLabelColorMappings(config) {
  return [
    {
      path: "data",
      mapToSpec: function(itemData, spec, item, id) {
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

module.exports = {
  getLineDateSeriesHandlingMappings: getLineDateSeriesHandlingMappings,
  getColumnDateSeriesHandlingMappings: getColumnDateSeriesHandlingMappings,
  getBarDateSeriesHandlingMappings: getBarDateSeriesHandlingMappings,
  getColumnPrognosisMappings: getColumnPrognosisMappings,
  getBarPrognosisMappings: getBarPrognosisMappings,
  getColumnLabelColorMappings: getColumnLabelColorMappings,
  getBarLabelColorMappings: getBarLabelColorMappings
};
