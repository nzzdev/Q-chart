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
      path: "item.options.highlightDataRows",
      mapToSpec: function(highlightDataRows, spec) {
        if (highlightDataRows.length === 0) {
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
    },
    {
      path: "item.options.highlightDataSeries",
      mapToSpec: function(highlightDataSeries, spec) {
        if (highlightDataSeries.length === 0) {
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
    },
    {
      path: "item.options.colorOverwritesRows",
      mapToSpec: function(colorOverwritesRows, spec) {
        for (const colorOverwrite of colorOverwritesRows) {
          //   // if we do not have a valid color or position, ignore this
          if (!colorOverwrite.color || Number.isNaN(colorOverwrite.position)) {
            continue;
          }
          spec.data[0].values.map(value => {
            if (value.xIndex === colorOverwrite.position) {
              value.color = colorOverwrite.color;
              if (colorOverwrite.colorLight) {
                value.colorLight = colorOverwrite.colorLight;
              }
            }
          });
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
    .concat(commonMappings.getColumnDateSeriesHandlingMappings())
    .concat(commonMappings.getColumnPrognosisMappings())
    .concat(commonMappings.getColumnLabelColorMappings())
    .concat(commonMappings.getHeightMappings());
};
