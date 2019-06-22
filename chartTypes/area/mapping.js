const clone = require("clone");
const objectPath = require("object-path");
const intervals = require("../../helpers/dateSeries.js").intervals;
const dataHelpers = require("../../helpers/data.js");
const commonMappings = require("../commonMappings.js");

module.exports = function getMappings() {
  return [
    {
      path: "item.data",
      mapToSpec: function(itemData, spec) {
        // set the x axis title
        objectPath.set(spec, "axes.0.title", itemData[0][0]);

        // check if we need to shorten the number labels
        const divisor = dataHelpers.getDivisor(itemData);

        spec.data[0].values = clone(itemData)
          .slice(1) // take the header row out of the array
          .map((row, rowIndex) => {
            const x = row.shift(); // take the x axis value out of the row
            return row.map((val, index) => {
              // generate one array entry for every data category on the same x value
              let value = null;
              if (!Number.isNaN(parseFloat(val))) {
                value = val / divisor;
              }
              return {
                xValue: x,
                xIndex: rowIndex,
                yValue: value,
                cValue: index
              };
            });
          })
          .reduce((acc, cur) => {
            // flatten the array
            return acc.concat(cur);
          }, []);
      }
    },
    {
      path: "item.options.hideAxisLabel",
      mapToSpec: function(hideAxisLabel, spec) {
        if (hideAxisLabel === true) {
          // unset the x axis label
          objectPath.set(spec, "axes.0.title", undefined);
          objectPath.set(spec, "height", spec.height - 20); // decrease the height because we do not need space for the axis title
        }
      }
    },
    {
      path: "item.options.areaChartOptions.areaInterpolation",
      mapToSpec: function(interpolation, spec) {
        if (interpolation) {
          objectPath.set(
            spec,
            "marks.0.marks.0.encode.enter.interpolate.value",
            interpolation
          );
        }
      }
    },
    {
      path: "item.options.areaChartOptions.showAsStreamGraph",
      mapToSpec: function(showAsStreamGraph, spec) {
        if (showAsStreamGraph) {
          objectPath.set(spec, "data.0.transform.0.offset", "center");
          objectPath.set(spec, "scales.1.nice", false); // set nice for the Y scale to false to draw stream from top to bottom
          delete spec.axes[1];
        }
      }
    },
    {
      path: "item.options.dateSeriesOptions.prognosisStart",
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
  ]
    .concat(commonMappings.getLineDateSeriesHandlingMappings())
    .concat(commonMappings.getHeightMappings())
    .concat(commonMappings.getHighlightMapping());
};
