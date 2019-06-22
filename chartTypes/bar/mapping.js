const objectPath = require("object-path");
const array2d = require("array2d");
const clone = require("clone");
const dataHelpers = require("../../helpers/data.js");
const intervals = require("../../helpers/dateSeries.js").intervals;

const commonMappings = require("../commonMappings.js");

const getLongestDataLabel = require("../../helpers/data.js")
  .getLongestDataLabel;
const textMetrics = require("vega").textMetrics;

function shouldHaveLabelsOnTopOfBar(mappingData) {
  const item = mappingData.item;
  // this does not work for positive and negative values. so if we have both, we do not show the labels on top
  const minValue = dataHelpers.getMinValue(item.data);
  const maxValue = dataHelpers.getMaxValue(item.data);
  if (minValue < 0 && maxValue > 0) {
    return false;
  }

  const longestLabel = getLongestDataLabel(mappingData, true);
  const textItem = {
    text: longestLabel
  };
  const longestLabelWidth = textMetrics.width(textItem);

  if (mappingData.width / 3 < longestLabelWidth) {
    return true;
  }
  return false;
}

module.exports = function getMapping() {
  return [
    {
      path: "item.data",
      mapToSpec: function(itemData, spec, mappingData) {
        const item = mappingData.item;
        // set the x axis title
        objectPath.set(spec, "axes.1.title", itemData[0][0]);

        // set the barWidth depending on the number of bars we will get
        const numberOfBars = (itemData.length - 1) * (itemData[0].length - 1);
        const barWidthSignal = spec.signals.find(signal => {
          return signal.name === "barWidth";
        });
        const groupPaddingSignal = spec.signals.find(signal => {
          return signal.name === "groupPadding";
        });

        if (numberOfBars === 1) {
          barWidthSignal.value = 48;
        } else if (numberOfBars > 10) {
          barWidthSignal.value = 16;
          groupPaddingSignal.value = 8;
        } else {
          barWidthSignal.value = 24;
          groupPaddingSignal.value = 16;
        }

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

        if (shouldHaveLabelsOnTopOfBar(mappingData)) {
          spec.axes[1].labels = false;

          // flush the X axis labels if we have the labels on top of the bar
          spec.axes[0].labelFlush = true;

          // align the axis alignment to the left if the labels are inside the chart
          spec.axes[1].encode.title.update.align = "left";

          const labelHeightSignal = spec.signals.find(
            signal => signal.name === "labelHeight"
          );
          labelHeightSignal.value = 16;

          // if we have a date series, we need to format the label accordingly
          // otherwise we use the exact xValue as the label
          const labelText = {};
          if (mappingData.dateFormat) {
            const d3format =
              intervals[item.options.dateSeriesOptions.interval].d3format;
            labelText.signal = `timeFormat(datum.xValue, '${
              intervals[item.options.dateSeriesOptions.interval].d3format
            }')`;
          } else {
            labelText.field = "xValue";
          }

          const labelMark = {
            type: "text",
            name: "bar-top-label",
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
          };

          // if all the values are negative, we right align the label
          const maxValue = dataHelpers.getMaxValue(itemData);
          if (maxValue <= 0) {
            labelMark.encode.update.x = { signal: "width" };
            labelMark.encode.update.align = { value: "right" };
          }

          spec.marks[0].marks[0].marks.push(labelMark);
        }
      }
    },
    {
      path: "item.options.hideAxisLabel",
      mapToSpec: function(hideAxisLabel, spec) {
        if (hideAxisLabel === true) {
          // unset the x axis label
          objectPath.set(spec, "axes.1.title", undefined);
          objectPath.set(spec, "height", spec.height - 30); // decrease the height because we do not need space for the axis title
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

        objectPath.set(spec, "scales.0.nice", false);
        objectPath.set(spec, "scales.0.domainMax", maxValue / divisor);
      }
    }
  ]
    .concat(commonMappings.getColorOverwritesRowsMappings())
    .concat(commonMappings.getHighlightMapping())
    .concat(commonMappings.getBarDateSeriesHandlingMappings())
    .concat(commonMappings.getBarPrognosisMappings())
    .concat(commonMappings.getBarLabelColorMappings());
};
