const objectPath = require("object-path");
const array2d = require("array2d");
const clone = require("clone");
const Decimal = require("decimal.js");
const dataHelpers = require("../../helpers/data.js");
const d3config = require("../../config/d3.js");

const commonMappings = require("../commonMappings.js");

const getLongestDataLabel = require("../../helpers/data.js")
  .getLongestDataLabel;
const textMetrics = require("vega").textMetrics;

const configuredDivergingColorSchemes = require("../../helpers/colorSchemes.js").getConfiguredDivergingColorSchemes();

module.exports = function getMapping() {
  return [
    {
      path: "item.data",
      mapToSpec: function(itemData, spec) {
        // set the x axis title
        objectPath.set(spec, "axes.1.title", itemData[0][0]);

        // set the arrowGroupHeight depending on the number of bars we will get
        const numberOfGroups = itemData.length - 1;
        const arrowGroupHeightSignal = spec.signals.find(signal => {
          return signal.name === "arrowGroupHeight";
        });
        if (numberOfGroups > 10) {
          arrowGroupHeightSignal.value = 16;
        } else {
          arrowGroupHeightSignal.value = 24;
        }

        // check if we need to shorten the number labels
        const divisor = dataHelpers.getDivisor(itemData);

        spec.data[0].values = clone(itemData)
          .slice(1) // take the header row out of the array
          .map((row, rowIndex) => {
            const x = row.shift(); // take the x axis value out of the row

            return row
              .map((value, index) => {
                // generate one array entry for every data category on the same x value

                let shortenedValue = null;
                if (!Number.isNaN(parseFloat(value))) {
                  shortenedValue = value / divisor;
                }

                const data = {
                  xValue: x,
                  xIndex: rowIndex,
                  yValue: shortenedValue,
                  cValue: index
                };

                return data;
              })
              .filter(data => {
                return (
                  !isNaN(data.yValue) &&
                  data.yValue !== null &&
                  data.yValue !== false &&
                  data.yValue !== true
                );
              })
              .map((data, index, row) => {
                // if this is the first data series, we calculate the diff to the next one
                // this is needed for the annotations.diff options

                // we round the diff to the maximum precision available in the source data
                // use the very nice Decimal.js lib for that
                const currentValue = new Decimal(data.yValue);

                if (index === 0) {
                  const nextValue = new Decimal(row[index + 1].yValue);
                  data.diffToNext = nextValue.minus(currentValue).toNumber();
                  data.diffToPrevious = null;
                } else {
                  const previousValue = new Decimal(row[index - 1].yValue);
                  data.diffToNext = null;
                  data.diffToPrevious = currentValue
                    .minus(previousValue)
                    .toNumber();
                }
                return data;
              })
              .map((data, index, row) => {
                // if there is no diffToNext value, this is the 2nd data series, so we take the color from the first one
                let diffToCheckForColor = data.diffToNext;
                if (data.diffToNext === null) {
                  diffToCheckForColor = row[0].diffToNext;
                }
                if (diffToCheckForColor > 0) {
                  data.colorScaleIndex = 2;
                } else if (diffToCheckForColor < 0) {
                  data.colorScaleIndex = 0;
                } else {
                  data.colorScaleIndex = 1;
                }
                return data;
              })
              .sort((a, b) => {
                // sort the array to have the lowest first and the largest last in the data
                // this is done to easier calculate helper properties for the annotations afterwords
                return a.yValue - b.yValue;
              })
              .map((data, index, row) => {
                // add isMax and isMin to be used by min/max annotation later
                data.isMax = index === row.length - 1;
                data.isMin = index === 0;
                return data;
              })
              .sort((a, b) => {
                // sort by cValue to build colorScale correctly
                // we messed before by sorting by the value for easier min/max
                return a.cValue - b.cValue;
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
          objectPath.set(spec, "axes.1.title", undefined);
          objectPath.set(spec, "height", spec.height - 30); // decrease the height because we do not need space for the axis title
        }
      }
    },
    {
      path: "item.options.arrowOptions.minValue",
      mapToSpec: function(minValue, spec, renderingInfoInput) {
        // check if we need to shorten the number labels
        const divisor = dataHelpers.getDivisor(renderingInfoInput.item.data);

        const dataMinValue = dataHelpers.getMinValue(
          renderingInfoInput.item.data
        );
        if (dataMinValue < minValue) {
          minValue = dataMinValue;
        }

        objectPath.set(spec, "scales.0.nice", false);
        objectPath.set(spec, "scales.0.domainMin", minValue / divisor);
      }
    },
    {
      path: "item.options.arrowOptions.maxValue",
      mapToSpec: function(maxValue, spec, renderingInfoInput) {
        // check if we need to shorten the number labels
        const divisor = dataHelpers.getDivisor(renderingInfoInput.item.data);

        const dataMaxValue = dataHelpers.getMaxValue(
          renderingInfoInput.item.data
        );
        if (dataMaxValue > maxValue) {
          maxValue = dataMaxValue;
        }

        objectPath.set(spec, "scales.0.nice", false);
        objectPath.set(spec, "scales.0.domainMax", maxValue / divisor);
      }
    },
    {
      path: "item.options.arrowOptions.colorScheme",
      mapToSpec: function(colorScheme, spec) {
        if (
          configuredDivergingColorSchemes &&
          configuredDivergingColorSchemes[colorScheme]
        ) {
          objectPath.set(
            spec,
            "scales.2.range.scheme",
            configuredDivergingColorSchemes[colorScheme].scheme_name
          );
        }
      }
    },
    {
      path: "item.options.annotations.first",
      mapToSpec: function(showFirstAnimation, spec) {
        if (!showFirstAnimation) {
          return;
        }
        spec.marks[0].marks[0].data.push({
          name: "firstAnnotationSeries",
          source: "series",
          transform: [{ type: "filter", expr: "datum.cValue === 0" }]
        });
        const diffTextMarksSpec = {
          type: "text",
          name: "annotation-label annotation-label--start",
          from: { data: "firstAnnotationSeries" },
          encode: {
            enter: {
              text: {
                signal: `format(datum.yValue, "${
                  d3config.formatLocale.decimal
                }")`
              },
              y: {
                signal: "arrowGroupHeight / 2"
              },
              x: [
                {
                  test: "datum.isMin === true",
                  signal: "scale('xScale', datum.yValue) - 8"
                },
                { signal: "scale('xScale', datum.yValue) + 8" }
              ],
              fill: { value: spec.config.axis.labelColor },
              align: [
                {
                  test: "datum.isMin === true",
                  value: "right"
                },
                { value: "left" }
              ],
              baseline: { value: "middle" },
              fontSize: { value: spec.config.text.fontSize + 2 }
            }
          }
        };
        spec.marks[0].marks[0].marks.push(diffTextMarksSpec);
      }
    },
    {
      path: "item.options.annotations.last",
      mapToSpec: function(showLastAnnotation, spec) {
        if (!showLastAnnotation) {
          return;
        }
        spec.marks[0].marks[0].data.push({
          name: "lastAnnotationSeries",
          source: "series",
          transform: [{ type: "filter", expr: "datum.cValue === 1" }]
        });
        const diffTextMarksSpec = {
          type: "text",
          name: "annotation-label annotation-label--end",
          from: { data: "lastAnnotationSeries" },
          encode: {
            enter: {
              text: {
                signal: `format(datum.yValue, "${
                  d3config.formatLocale.decimal
                }")`
              },
              y: {
                signal: "arrowGroupHeight / 2"
              },
              x: [
                {
                  test: "datum.isMin === true",
                  signal: "scale('xScale', datum.yValue) - 8"
                },
                { signal: "scale('xScale', datum.yValue) + 8" }
              ],
              fill: { value: spec.config.axis.labelColor },
              align: [
                {
                  test: "datum.isMin === true",
                  value: "right"
                },
                { value: "left" }
              ],
              baseline: { value: "middle" },
              fontSize: { value: spec.config.text.fontSize + 2 }
            }
          }
        };
        spec.marks[0].marks[0].marks.push(diffTextMarksSpec);
      }
    },
    {
      path: "item.options.annotations.diff",
      mapToSpec: function(showDiffAnnotation, spec) {
        if (!showDiffAnnotation) {
          return;
        }

        spec.marks[0].marks[0].data.push({
          name: "diffAnnotationSeries",
          source: "series",
          transform: [
            { type: "filter", expr: "datum.diffToNext !== null" },
            {
              type: "aggregate", // this makes the diffToNext entries unique by yValue, so if they are stacked, we have only one annotation
              groupby: ["yValue"],
              fields: ["yValue", "diffToNext"],
              as: ["yValue", "diffToNext"],
              ops: ["min", "min"]
            }
          ]
        });
        const diffTextMarksSpec = {
          type: "text",
          name: "annotation-label annotation-label--diff",
          from: { data: "diffAnnotationSeries" },
          encode: {
            enter: {
              text: {
                signal: `format(datum.diffToNext, "${
                  d3config.formatLocale.decimal
                }")`
              },
              y: {
                signal: "arrowGroupHeight / 2 - 4"
              },
              x: {
                scale: "xScale",
                signal: "datum.yValue + (datum.diffToNext / 2)"
              },
              fill: { value: spec.config.axis.labelColor },
              align: { value: "center" },
              baseline: { value: "bottom" },
              fontSize: { value: spec.config.text.fontSize + 2 }
            }
          }
        };
        spec.marks[0].marks[0].marks.push(diffTextMarksSpec);
      }
    }
  ].concat(commonMappings.getBarLabelColorMappings());
};
