const objectPath = require("object-path");
const array2d = require("array2d");
const clone = require("clone");
const dataHelpers = require("../../helpers/data.js");

const commonMappings = require("../commonMappings.js");

module.exports = function getMapping() {
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
          .flat();

        const numberOfDataSeriesSignal = spec.signals.find(
          signal => signal.name === "numberOfDataSeries"
        );
        numberOfDataSeriesSignal.value = itemData[0].length - 1; // the first column is not a data column, so we subtract it
      }
    },
    {
      path: "item.data",
      mapToSpec: function(itemData, spec) {
        // check if all rows sum up to 100
        const stackedSums = itemData
          .slice(1)
          .map(row => {
            return row.slice(1).reduce((sum, cell) => {
              return sum + cell;
            }, 0);
          })
          .reduce((uniqueSums, sum) => {
            if (!uniqueSums.includes(sum)) {
              uniqueSums.push(sum);
            }
            return uniqueSums;
          }, []);

        // if the sums are not unique or do not equal 100, do nothing
        if (stackedSums.length !== 1 || Math.floor(stackedSums[0]) !== 100) {
          return;
        }

        // set the ticks to 0/25/50/75/100
        objectPath.set(spec, "axes.1.tickCount", undefined);
        objectPath.set(spec, "axes.1.values", [0, 25, 50, 75, 100]);
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
      path: "item.options.barOptions.maxValue",
      mapToSpec: function(maxValue, spec, mappingData) {
        // check if we need to shorten the number labels
        const divisor = dataHelpers.getDivisor(mappingData.item.data);

        const dataMaxValue = dataHelpers.getMaxValue(mappingData.item.data);
        if (dataMaxValue > maxValue) {
          maxValue = dataMaxValue;
        }

        objectPath.set(spec, "scales.1.nice", false);
        objectPath.set(spec, "scales.1.domainMax", maxValue / divisor);
      }
    }
  ]
    .concat(commonMappings.getColorOverwritesRowsMappings())
    .concat(commonMappings.getHighlightRowsMapping())
    .concat(commonMappings.getHighlightSeriesMapping())
    .concat(commonMappings.getColumnDateSeriesHandlingMappings())
    .concat(commonMappings.getColumnAreaPrognosisMappings())
    .concat(commonMappings.getColumnLabelColorMappings())
    .concat(commonMappings.getHeightMappings());
};
