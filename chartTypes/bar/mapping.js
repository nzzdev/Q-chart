const objectPath = require("object-path");
const array2d = require("array2d");
const clone = require("clone");
const dataHelpers = require("../../helpers/data.js");
const intervals = require("../../helpers/dateSeries.js").intervals;

const getBarDateSeriesHandlingMappings = require("../commonMappings.js")
  .getBarDateSeriesHandlingMappings;

const getBarPrognosisMappings = require("../commonMappings.js")
  .getBarPrognosisMappings;

const getLongestDataLabel = require("../../helpers/data.js")
  .getLongestDataLabel;
const textMetrics = require("vega").textMetrics;

function shouldHaveLabelsOnTopOfBar(itemData, config) {
  const longestLabel = getLongestDataLabel(itemData, true);
  const item = {
    text: longestLabel
  };
  const longestLabelWidth = textMetrics.width(item);

  if (config.width / 3 < longestLabelWidth) {
    return true;
  }
  return false;
}

module.exports = function getMapping(config = {}) {
  return [
    {
      path: "data",
      mapToSpec: function(itemData, spec, item) {
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

        const numberOfDataSeriesSignal = spec.signals.find(
          signal => signal.name === "numberOfDataSeries"
        );
        numberOfDataSeriesSignal.value = itemData[0].length - 1; // the first column is not a data column, so we subtract it

        if (shouldHaveLabelsOnTopOfBar(itemData, config)) {
          spec.axes[1].labels = false;

          const labelHeightSignal = spec.signals.find(
            signal => signal.name === "labelHeight"
          );
          labelHeightSignal.value = 16;

          // if we have a date series, we need to format the label accordingly
          // otherwise we use the exact xValue as the label
          const labelText = {};
          if (config.dateFormat) {
            const d3format =
              intervals[item.options.dateSeriesOptions.interval].d3format;
            labelText.signal = `timeFormat(datum.xValue, '${
              intervals[item.options.dateSeriesOptions.interval].d3format
            }')`;
          } else {
            labelText.field = "xValue";
          }

          spec.marks[0].marks[0].marks.push({
            type: "text",
            from: {
              data: "xValues"
            },
            encode: {
              update: {
                text: labelText,
                y: {
                  signal: "-labelHeight/2"
                },
                baseline: {
                  value: "middle"
                }
              }
            }
          });
        }
      }
    }
  ]
    .concat(getBarDateSeriesHandlingMappings(config))
    .concat(getBarPrognosisMappings(config));
};
