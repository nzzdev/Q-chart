const objectPath = require("object-path");
const array2d = require("array2d");
const clone = require("clone");
const Decimal = require("decimal.js");
const dataHelpers = require("../../helpers/data.js");
const d3config = require("../../config/d3.js");

const commonMappings = require("../commonMappings.js");
const { group } = require("d3-array");

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
        const divisor = dataHelpers.getDivisor(
          itemData,
          item.options.largeNumbers
        );

        // estimate X domain
        const maxDataValue = Math.max(dataHelpers.getMaxValue(item.data));
        const minDataValue = Math.min(dataHelpers.getMinValue(item.data));
        const maxValueRounder =
          maxDataValue < 50
            ? maxDataValue
            : Math.ceil((maxDataValue + 1) / 10) * 10;
        const minValueRounder =
          minDataValue > -50
            ? minDataValue
            : Math.ceil((Math.abs(maxDataValue) + 1) / 10) * -10;

        // estimate how many pixel is one data unit
        const unitInPixel =
          spec.width /
          ((spec.scales[0].domainMax || Math.max(0, maxValueRounder)) -
            (spec.scales[0].domainMin || Math.min(0, minValueRounder)));

        spec.data[0].values = clone(itemData)
          .slice(1) // take the header row out of the array
          .map((row, rowIndex) => {
            const x = row.shift(); // take the x axis value out of the row

            // the row to return
            const dataRow = row
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
                };

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
              });

            // group close values that would overlap
            // we need to do this after diffToPrevious is calculated
            // prepared group to spread later { number of elements, total value for smoothing }
            const emptyThresholdGroup = { size: 0, totalValue: 0 };
            // groups as array [ leading zero element, first group ]
            const thresholdGroups = [0, { ...emptyThresholdGroup }];
            let currentThresholdGroup = 1; // current group index
            let diffFromFirstElement = 0; // accumulate difference from the first group element
            // pixel size of the dot including stroke ( should be 14 but it seems to overlap with that)
            const dotPixelSize = 15;
            // go through the row in reverse, since diffToPrevious is used, it is simpler
            // it also effects the visualisation later, arrange earliest-top and latest-bottom
            for (let i = dataRow.length - 1; i > -1; i--) {
              if (
                (dataRow[i].diffToPrevious !== null &&
                  dataRow[i].diffToPrevious * unitInPixel < dotPixelSize) ||
                (dataRow[i + 1] &&
                  dataRow[i + 1].diffToPrevious * unitInPixel < dotPixelSize)
              ) {
                // passed the threshold check
                thresholdGroups[currentThresholdGroup].size++; // increment group size
                thresholdGroups[currentThresholdGroup].totalValue +=
                  dataRow[i].yValue; // add total group value
                dataRow[i].thresholdGroup = currentThresholdGroup; // set data attribute for visualisation
                diffFromFirstElement += dataRow[i].diffToPrevious; // add difference
              }

              // limit group based on size and distance difference
              // start new group if needed
              if (
                dataRow[i].diffToPrevious * unitInPixel > dotPixelSize ||
                thresholdGroups[currentThresholdGroup].size >
                  (item.options.dotplotOptions.maxGroupSize - 1 || 3) ||
                diffFromFirstElement * unitInPixel > dotPixelSize * 1.5
              ) {
                thresholdGroups.push({ ...emptyThresholdGroup });
                currentThresholdGroup++;
                diffFromFirstElement = 0;
              }
            }

            // if we have grouped values, we add some correction factor here to calculate
            // the circles position (stacked if similar value)
            // calculate the first correction factor
            // this gives us a currentCorrectionFactor like this
            // groupsize    factors
            // 1            0
            // 2            -0.5 0.5
            // 3            -1 0 1
            // 4            -1.5 -0.5 0.5 1.5
            // 5            -2 -1 0 1 2
            const thresholdCorrectionValues = [];
            // we also calculate the smooth value (avarage)
            const thresholdSmoothValues = [];

            thresholdGroups.map((group) => {
              if (group.size > 0) {
                thresholdCorrectionValues.push((group.size - 1) * -0.5);
                thresholdSmoothValues.push(
                  Math.round(group.totalValue / group.size)
                );
              } else {
                thresholdCorrectionValues.push(0);
                thresholdSmoothValues.push(0);
              }
            });

            return dataRow
              .map((data) => {
                // smooth values
                if (mappingData.item.options.dotplotOptions.smoothing) {
                  data.yValue =
                    thresholdSmoothValues[data.thresholdGroup] || data.yValue;
                }
                // set the correction factor for all data
                data.posCorrectionFactor =
                  thresholdCorrectionValues[data.thresholdGroup] || 0;
                // add one to the correction values
                // so the next in group will be offset
                thresholdCorrectionValues[data.thresholdGroup]++;

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
        const divisor = dataHelpers.getDivisor(
          mappingData.item.data,
          mappingData.item.options.largeNumbers
        );

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
        const divisor = dataHelpers.getDivisor(
          mappingData.item.data,
          mappingData.item.options.largeNumbers
        );

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
    // {
    //   path: "item.options.dotPlotOptions.smoothing",
    //   mapToSpec: function( smoothing, spec, mappingData ){
    //     objectPath.set(spec, "smoothing", smoothing )
    //   }
    //}
  ]
    .concat(commonMappings.getColorOverwritesRowsMappings())
    .concat(commonMappings.getHighlightRowsMapping())
    .concat(commonMappings.getHighlightSeriesMapping())
    .concat(commonMappings.getBarLabelColorMappings());
};
