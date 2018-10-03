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
          .reduce((acc, cur) => {
            // flatten the array
            return acc.concat(cur);
          }, []);

        const numberOfDataSeriesSignal = spec.signals.find(
          signal => signal.name === "numberOfDataSeries"
        );
        numberOfDataSeriesSignal.value = itemData[0].length - 1; // the first column is not a data column, so we subtract it
      }
    },
    {
      path: "toolRuntimeConfig.displayOptions.size",
      mapToSpec: function(size, spec) {
        let height;
        if (size === "prominent") {
          // Aspect ratio 16:9
          height = spec.width * (9 / 16);
          if (height < 240) {
            height = 240;
          }
          objectPath.set(spec, "height", height + 20); // increase the height because we need space for the axis title
        } else {
          // Aspect ratio 7:3
          height = spec.width * (3 / 7);
          if (height < 240) {
            height = 240;
          }
          objectPath.set(spec, "height", height + 20); // increase the height because we need space for the axis title
        }
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
      mapToSpec: function(maxValue, spec, renderingInfoInput) {
        // check if we need to shorten the number labels
        const divisor = dataHelpers.getDivisor(renderingInfoInput.item.data);

        const dataMaxValue = dataHelpers.getMaxValue(
          renderingInfoInput.item.data
        );
        if (dataMaxValue > maxValue) {
          maxValue = dataMaxValue;
        }

        objectPath.set(spec, "scales.1.nice", false);
        objectPath.set(spec, "scales.1.domainMax", maxValue / divisor);
      }
    }
  ]
    .concat(commonMappings.getColumnDateSeriesHandlingMappings())
    .concat(commonMappings.getColumnPrognosisMappings())
    .concat(commonMappings.getColumnLabelColorMappings());
};
