const objectPath = require("object-path");
const array2d = require("array2d");
const clone = require("clone");
const dataHelpers = require("../../helpers/data.js");

const intervals = require("../../helpers/dateSeries.js").intervals;

const commonMappings = require("../commonMappings.js");

const getLongestDataLabel = require("../../helpers/data.js")
  .getLongestDataLabel;
const textMetrics = require("vega").textMetrics;

function shouldHaveLabelsOnTopOfBar(item, config) {
  // this does not work for positive and negative values. so if we have both, we do not show the labels on top
  const minValue = dataHelpers.getMinValue(item.data);
  const maxValue = dataHelpers.getMaxValue(item.data);
  if (minValue < 0 && maxValue > 0) {
    return false;
  }

  const longestLabel = getLongestDataLabel(item, config, true);
  const textItem = {
    text: longestLabel
  };
  const longestLabelWidth = textMetrics.width(textItem);

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
        // set the x axis title
        objectPath.set(spec, "axes.1.title", itemData[0][0]);

        // set the dotGroupHeight depending on the number of bars we will get
        const numberOfBars = itemData.length - 1;
        const dotGroupHeightSignal = spec.signals.find(signal => {
          return signal.name === "dotGroupHeight";
        });
        if (numberOfBars > 10) {
          dotGroupHeightSignal.value = 16;
        } else {
          dotGroupHeightSignal.value = 24;
        }

        // check if we need to shorten the number labels
        const divisor = dataHelpers.getDivisor(itemData);

        spec.data[0].values = clone(itemData)
          .slice(1) // take the header row out of the array
          .map((row, rowIndex) => {
            const x = row.shift(); // take the x axis value out of the row

            // count the single occurences of the values in this row to see if we have duplicates
            const valueOccurences = row.reduce((all, current) => {
              return Object.assign(all, {
                [current]: {
                  occurences:
                    ((all[current] && all[current].occurences) || 0) + 1
                }
              });
            }, {});

            // calculate the first correction factor
            // this gives us a currentCorrectionFactor like this
            // occurences   factors
            // 1            0
            // 2            -0.5 0.5
            // 3            -1 0 1
            // 4            -1.5 -0.5 0.5 1.5
            // 5            -2 -1 0 1 2
            for (let value in valueOccurences) {
              valueOccurences[value].currentCorrectionFactor =
                (valueOccurences[value].occurences - 1) * -0.5;
            }

            return row.map((val, index) => {
              // generate one array entry for every data category on the same x value
              let value = null;
              if (!Number.isNaN(parseFloat(val))) {
                value = val / divisor;
              }

              const data = {
                xValue: x,
                xIndex: rowIndex,
                yValue: value,
                cValue: index,
                posCorrectionFactor:
                  valueOccurences[value].currentCorrectionFactor
              };

              // increase the currentCorrectionFactor for this value by 1
              valueOccurences[value].currentCorrectionFactor =
                valueOccurences[value].currentCorrectionFactor + 1;

              return data;
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

        if (shouldHaveLabelsOnTopOfBar(item, config)) {
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
          });
        }
      }
    },
    {
      path: "options.hideAxisLabel",
      mapToSpec: function(hideAxisLabel, spec, item) {
        if (hideAxisLabel === true) {
          // unset the x axis label
          objectPath.set(spec, "axes.1.title", undefined);
          objectPath.set(spec, "height", spec.height - 30); // decrease the height because we do not need space for the axis title
        }
      }
    },
    {
      path: "options.dotplotOptions.minValue",
      mapToSpec: function(minValue, spec, item) {
        // check if we need to shorten the number labels
        const divisor = dataHelpers.getDivisor(item.data);

        const dataMinValue = dataHelpers.getMinValue(item.data);
        if (dataMinValue < minValue) {
          minValue = dataMinValue;
        }

        objectPath.set(spec, "scales.0.nice", false);
        objectPath.set(spec, "scales.0.domainMin", minValue / divisor);
      }
    },
    {
      path: "options.dotplotOptions.maxValue",
      mapToSpec: function(maxValue, spec, item) {
        // check if we need to shorten the number labels
        const divisor = dataHelpers.getDivisor(item.data);

        const dataMaxValue = dataHelpers.getMaxValue(item.data);
        if (dataMaxValue > maxValue) {
          maxValue = dataMaxValue;
        }

        objectPath.set(spec, "scales.0.nice", false);
        objectPath.set(spec, "scales.0.domainMax", maxValue / divisor);
      }
    },
    {
      path: "options.dotplotOptions.connectDots",
      mapToSpec: function(connectDots, spec, item) {
        if (!connectDots) {
          return;
        }
        const dotConnectionLineSpec = {
          type: "line",
          name: "line",
          from: {
            data: "series"
          },
          encode: {
            enter: {
              y: {
                signal: "dotGroupHeight / 2"
              },
              x: {
                scale: "xScale",
                field: "yValue"
              },
              x2: {
                scale: "xScale",
                field: "yValue"
              },
              stroke: {
                value: spec.config.axis.labelColor
              },
              strokeWidth: {
                value: 2
              }
            }
          }
        };
        spec.marks[0].marks[0].marks.unshift(dotConnectionLineSpec);
      }
    }
  ]
    .concat(commonMappings.getBarDateSeriesHandlingMappings(config))
    .concat(commonMappings.getBarPrognosisMappings(config))
    .concat(commonMappings.getBarLabelColorMappings(config));
};
