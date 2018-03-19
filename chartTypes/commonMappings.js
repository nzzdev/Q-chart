const objectPath = require("object-path");
const intervals = require("../helpers/dateSeries.js").intervals;

function getDateSeriesHandlingMappings(config = {}) {
  return [
    {
      path: "data", // various settings that are not tied to an option
      mapToSpec: function(itemData, spec) {
        if (config.dateFormat) {
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
        if (config.dateFormat) {
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
    },
    {
      path: "options.dateSeriesOptions.prognosisStart",
      mapToSpec: function(prognosisStart, spec) {
        if (prognosisStart === null) {
          return;
        }
        // add the signal
        objectPath.push(spec, "signals", {
          name: "prognosisStart",
          value: prognosisStart
        });

        // split the marks at the prognosisStart index
        const lineMark = clone(spec.marks[0].marks[0]);
        lineMark.encode.enter.defined = {
          signal: "datum.yValue !== null && datum.xIndex <= prognosisStart"
        };
        const lineMarkPrognosis = clone(spec.marks[0].marks[0]);
        lineMarkPrognosis.encode.enter.defined = {
          signal: "datum.yValue !== null && datum.xIndex >= prognosisStart"
        };
        lineMarkPrognosis.style = "prognosisLine";
        spec.marks[0].marks = [lineMark, lineMarkPrognosis];
      }
    }
  ];
}

module.exports = {
  getDateSeriesHandlingMappings: getDateSeriesHandlingMappings
};