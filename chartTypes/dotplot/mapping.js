const objectPath = require("object-path");
const array2d = require("array2d");
const clone = require("clone");
const Decimal = require("decimal.js");
const dataHelpers = require("../../helpers/data.js");
const d3config = require("../../config/d3.js");

const commonMappings = require("../commonMappings.js");

module.exports = function getMapping() {
  return [
    {
      path: "item.data",
      mapToSpec: function (itemData, spec, mappingData) {
        const item = mappingData.item;

        // set the x axis title
        objectPath.set(spec, "axes.1.title", itemData[0][0]);

        // set the dotGroupHeight depending on the number of bars we will get
        const numberOfGroups = itemData.length - 1;
        const dotGroupHeightSignal = spec.signals.find((signal) => {
          return signal.name === "dotGroupHeight";
        });
        const groupPaddingSignal = spec.signals.find((signal) => {
          return signal.name === "groupPadding";
        });

        if (numberOfGroups > 10) {
          dotGroupHeightSignal.value = 16;
          if (!item.options.annotations.diff) {
            groupPaddingSignal.value = 8;
          }
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
                    ((all[current] && all[current].occurences) || 0) + 1,
                },
              });
            }, {});

            // if we have duplicate values, we add some correction factor here to calculate
            // the circles position (stacked if same value)
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
                  cValue: index,
                  posCorrectionFactor:
                    valueOccurences[value].currentCorrectionFactor,
                };

                // increase the currentCorrectionFactor for this value by 1
                valueOccurences[value].currentCorrectionFactor =
                  valueOccurences[value].currentCorrectionFactor + 1;

                return data;
              })
              .filter((data) => {
                return (
                  !isNaN(data.yValue) &&
                  data.yValue !== null &&
                  data.yValue !== false &&
                  data.yValue !== true
                );
              })
              .sort((a, b) => {
                // sort the array to have the lowest first and the largest last in the data
                // this is done to easier calculate helper properties for the annotations afterwords
                return a.yValue - b.yValue;
              })
              .map((data, index, row) => {
                // add isMax and isMin to be used by min/max annotation later
                data.isMax = index === row.length - 1;

                // add only if we have more than one data series to not have doubled labels for the same point
                data.isMin = index === 0 && row.length > 1;
                return data;
              })
              .map((data, index, row) => {
                // if this is not the first data series, we calculate the diff to the previous one
                // this is needed for the annotations.diff options
                if (index !== 0) {
                  // we round the diff to the maximum precision availble in the source data
                  const currentValue = new Decimal(data.yValue);
                  const previousValue = new Decimal(row[index - 1].yValue);

                  data.diffToPrevious = currentValue
                    .minus(previousValue)
                    .abs()
                    .toNumber();
                } else {
                  data.diffToPrevious = null;
                }
                return data;
              })
              .sort((a, b) => {
                // sort by cValue to build colorScale correctly
                // we messed before by sorting by the value for easier min/max
                return a.cValue - b.cValue;
              });
          })
          .flat();
      },
    },
    {
      path: "item.options.hideAxisLabel",
      mapToSpec: function (hideAxisLabel, spec) {
        if (
          hideAxisLabel === true ||
          objectPath.get(spec, "axes.1.title").length < 1
        ) {
          // unset the x axis label
          objectPath.set(spec, "axes.1.title", undefined);
          objectPath.set(spec, "height", spec.height - 30); // decrease the height because we do not need space for the axis title
        }
      },
    },
    {
      path: "item.options.dotplotOptions.minValue",
      mapToSpec: function (minValue, spec, mappingData) {
        // check if we need to shorten the number labels
        const divisor = dataHelpers.getDivisor(mappingData.item.data);

        const dataMinValue = dataHelpers.getMinValue(mappingData.item.data);
        if (dataMinValue < minValue) {
          minValue = dataMinValue;
        }

        objectPath.set(spec, "scales.0.nice", false);
        objectPath.set(spec, "scales.0.domainMin", minValue / divisor);
      },
    },
    {
      path: "item.options.dotplotOptions.maxValue",
      mapToSpec: function (maxValue, spec, mappingData) {
        // check if we need to shorten the number labels
        const divisor = dataHelpers.getDivisor(mappingData.item.data);

        const dataMaxValue = dataHelpers.getMaxValue(mappingData.item.data);
        if (dataMaxValue > maxValue) {
          maxValue = dataMaxValue;
        }

        objectPath.set(spec, "scales.0.nice", false);
        objectPath.set(spec, "scales.0.domainMax", maxValue / divisor);
      },
    },
    {
      path: "item.options.dotplotOptions.connectDots",
      mapToSpec: function (connectDots, spec, mappingData) {
        if (!connectDots) {
          return;
        }
        const dotConnectionLineSpec = {
          type: "line",
          name: "line",
          from: {
            data: "series",
          },
          encode: {
            enter: {
              y: {
                signal: "dotGroupHeight / 2",
              },
              x: {
                scale: "xScale",
                field: "yValue",
              },
              strokeMiterLimit: 0,
              strokeWidth: {
                value: 2,
              },
              stroke: [
                {
                  test: "datum.isHighlighted === true",
                  value: spec.config.axis.labelColor,
                },
                {
                  test: "datum.isHighlighted === false",
                  value:
                    spec.config.axis.labelColorLight ||
                    spec.config.axis.labelColor,
                },
                {
                  value: spec.config.axis.labelColor,
                },
              ],
            },
          },
        };
        spec.marks[0].marks[0].marks.unshift(dotConnectionLineSpec);
      },
    },
    {
      path: "item.options.annotations.min",
      mapToSpec: function (showMinAnnotation, spec) {
        if (!showMinAnnotation) {
          return;
        }
        spec.marks[0].marks[0].data.push({
          name: "minAnnotationSeries",
          source: "series",
          transform: [{ type: "filter", expr: "datum.isMin === true" }],
        });
        const diffTextMarksSpec = {
          type: "text",
          name: "annotation-label annotation-label--min",
          from: { data: "minAnnotationSeries" },
          encode: {
            enter: {
              text: {
                signal: `format(datum.yValue, "${d3config.specifier}")`,
              },
              y: {
                signal: "dotGroupHeight / 2",
              },
              x: {
                signal: "scale('xScale', datum.yValue) - 8",
              },
              fill: [
                {
                  test: "datum.isHighlighted === true",
                  value: spec.config.axis.labelColor,
                },
                {
                  test: "datum.isHighlighted === false",
                  value:
                    spec.config.axis.labelColorLight ||
                    spec.config.axis.labelColor,
                },
                {
                  value: spec.config.axis.labelColor,
                },
              ],
              align: { value: "right" },
              baseline: { value: "middle" },
              fontSize: { value: spec.config.text.fontSize + 2 },
            },
          },
        };
        spec.marks[0].marks[0].marks.push(diffTextMarksSpec);
      },
    },
    {
      path: "item.options.annotations.max",
      mapToSpec: function (showMaxAnnotation, spec) {
        if (!showMaxAnnotation) {
          return;
        }
        spec.marks[0].marks[0].data.push({
          name: "maxAnnotationSeries",
          source: "series",
          transform: [{ type: "filter", expr: "datum.isMax === true" }],
        });
        const diffTextMarksSpec = {
          type: "text",
          name: "annotation-label annotation-label--max",
          from: { data: "maxAnnotationSeries" },
          encode: {
            enter: {
              text: {
                signal: `format(datum.yValue, "${d3config.specifier}")`,
              },
              y: {
                signal: "dotGroupHeight / 2",
              },
              x: {
                signal: "scale('xScale', datum.yValue) + 8",
              },
              fill: [
                {
                  test: "datum.isHighlighted === true",
                  value: spec.config.axis.labelColor,
                },
                {
                  test: "datum.isHighlighted === false",
                  value:
                    spec.config.axis.labelColorLight ||
                    spec.config.axis.labelColor,
                },
                {
                  value: spec.config.axis.labelColor,
                },
              ],
              align: { value: "left" },
              baseline: { value: "middle" },
              fontSize: { value: spec.config.text.fontSize + 2 },
            },
          },
        };
        spec.marks[0].marks[0].marks.push(diffTextMarksSpec);
      },
    },
    {
      path: "item.options.annotations.diff",
      mapToSpec: function (showDiffAnnoation, spec) {
        if (!showDiffAnnoation) {
          return;
        }

        spec.marks[0].marks[0].data.push({
          name: "diffAnnotationSeries",
          source: "series",
          transform: [
            { type: "filter", expr: "datum.diffToPrevious !== null" },
            {
              type: "aggregate", // this makes the diffToPrevious entries unique by yValue, so if they are stacked, we have only one annotation
              groupby: ["yValue"],
              fields: ["yValue", "diffToPrevious", "posCorrectionFactor"],
              as: ["yValue", "diffToPrevious", "posCorrectionFactor"],
              ops: ["min", "min", "max"], // important to take the max posCorrectionFactor
            },
          ],
        });
        const diffTextMarksSpec = {
          type: "text",
          name: "annotation-label annotation-label--diff",
          from: { data: "diffAnnotationSeries" },
          encode: {
            enter: {
              text: [
                {
                  test: "datum.diffToPrevious == 0",
                  value: "",
                },
                {
                  signal: `format(datum.diffToPrevious, "${d3config.specifier}")`,
                },
              ],
              y: {
                signal:
                  "dotGroupHeight / 2 - 4 - (datum.posCorrectionFactor * 11)",
              },
              x: {
                scale: "xScale",
                signal: "datum.yValue - (datum.diffToPrevious / 2)",
              },
              fill: [
                {
                  test: "datum.isHighlighted === true",
                  value: spec.config.axis.labelColor,
                },
                {
                  test: "datum.isHighlighted === false",
                  value:
                    spec.config.axis.labelColorLight ||
                    spec.config.axis.labelColor,
                },
                {
                  value: spec.config.axis.labelColor,
                },
              ],
              align: { value: "center" },
              baseline: { value: "bottom" },
              fontSize: { value: spec.config.text.fontSize + 2 },
            },
          },
        };
        spec.marks[0].marks[0].marks.push(diffTextMarksSpec);
      },
    },
  ]
    .concat(commonMappings.getColorOverwritesRowsMappings())
    .concat(commonMappings.getHighlightRowsMapping())
    .concat(commonMappings.getHighlightSeriesMapping())
    .concat(commonMappings.getBarLabelColorMappings());
};
