const objectPath = require("object-path");
const array2d = require("array2d");
const clone = require("clone");
const dataHelpers = require("../../helpers/data.js");

const commonMappings = require("../commonMappings.js");

const textMeasure = require("../../helpers/textMeasure.js");

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
    },
    {
      path: "item.options.annotations.valuesOnBars",
      mapToSpec: function(valuesOnBars, spec, mappingData) {
        if (!valuesOnBars) {
          return;
        }

        const numberOfDataSeriesSignal = spec.signals.find(
          signal => signal.name === "numberOfDataSeries"
        );

        // One idea to limit the chance of overlapping was to limit it to 10 dataseries
        // as we measure now, this is not needed. The code stays here for reference
        // only show values if max 10 columns (to have less chance of overlapping)
        // if (numberOfDataSeriesSignal.value >= 10) {
        //   return;
        // }

        // measure the labels to check if there is enough space to show them, and don't if there is not
        // name the option somehow: "show values on bars if possible"
        const labelsSortedByLength = spec.data[0].values
          .map(entry => entry.yValue)
          .sort((a, b) => {
            if (a && b) {
              return b.toString().length - a.toString().length;
            } else if (!a) {
              return 1;
            } else if (!b) {
              return -1;
            }
          });
        const longestLabelWidth = textMeasure.getLabelTextWidth(
          labelsSortedByLength[0],
          mappingData.toolRuntimeConfig
        );

        const valuePadding = 2;
        const valueLabelMark = {
          type: "text",
          from: {
            data: "bar"
          },
          encode: {
            enter: {
              y: {
                signal: `datum.y - ${valuePadding}`
              },
              baseline: {
                value: "bottom"
              },
              x: {
                signal: "datum.x + (datum.width / 2)"
              },
              fill: [
                {
                  value: mappingData.toolRuntimeConfig.text.fill
                }
              ],
              text: [
                {
                  test: `datum.width > ${longestLabelWidth}`, // only show the labels if they are less wide than the rects of the columns
                  // test: `columnWidth > ${longestLabelWidth}`, // this would be an alternative, showing the labels if they are less wide than the column + its margin
                  field: "datum.yValue"
                },
                {
                  value: ""
                }
              ],
              align: {
                value: "center"
              }
            }
          }
        };

        // add the value label marks
        spec.marks[0].marks.push(valueLabelMark);

        // hide things on the X axis
        objectPath.set(spec, "axes.1.grid", false);
        objectPath.set(spec, "axes.1.ticks", false);
        objectPath.set(spec, "axes.1.labels", false);
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
