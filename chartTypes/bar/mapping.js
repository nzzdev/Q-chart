const objectPath = require("object-path");
const array2d = require("array2d");
const clone = require("clone");
const dataHelpers = require("../../helpers/data.js");
const intervals = require("../../helpers/dateSeries.js").intervals;
const d3config = require("../../config/d3.js");
const d3format = require("d3-format");
const locale = d3format.formatLocale(d3config.formatLocale);
const format = locale.format(d3config.specifier);

const commonMappings = require("../commonMappings.js");

const getLongestDataLabel =
  require("../../helpers/data.js").getLongestDataLabel;

const textMeasure = require("../../helpers/textMeasure.js");

function shouldHaveLabelsOnTopOfBar(mappingData) {
  const item = mappingData.item;
  // this does not work for positive and negative values. so if we have both, we do not show the labels on top
  const minValue = dataHelpers.getMinValue(item.data);
  const maxValue = dataHelpers.getMaxValue(item.data);
  if (minValue < 0 && maxValue > 0) {
    return false;
  }

  const longestLabel = getLongestDataLabel(mappingData, true);
  const longestLabelWidth = textMeasure.getLabelTextWidth(
    longestLabel,
    mappingData.toolRuntimeConfig
  );

  if (mappingData.width / 3 < longestLabelWidth) {
    return true;
  }
  return false;
}

module.exports = function getMapping() {
  return [
    {
      path: "item.data",
      mapToSpec: function (itemData, spec, mappingData) {
        const item = mappingData.item;
        // set the x axis title
        objectPath.set(spec, "axes.1.title", itemData[0][0]);

        // set the barWidth depending on the number of bars we will get
        const numberOfBars = (itemData.length - 1) * (itemData[0].length - 1);
        const barWidthSignal = spec.signals.find((signal) => {
          return signal.name === "barWidth";
        });
        const groupPaddingSignal = spec.signals.find((signal) => {
          return signal.name === "groupPadding";
        });

        if (numberOfBars === 1) {
          barWidthSignal.value = 48;
        } else if (numberOfBars > 5) {
          if (
            (item.options.annotations &&
              item.options.annotations.valuesOnBars) ||
            shouldHaveLabelsOnTopOfBar(mappingData)
          ) {
            barWidthSignal.value = 16;
            groupPaddingSignal.value = 8;
          } else {
            barWidthSignal.value = 14;
            groupPaddingSignal.value = 6;
          }
        } else {
          barWidthSignal.value = 24;
          groupPaddingSignal.value = 16;
        }

        // check if we need to shorten the number labels
        const divisor = dataHelpers.getDivisor(
          itemData,
          mappingData.item.options.largeNumbers
        );

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
                cValue: index,
                labelWidth: textMeasure.getLabelTextWidth(
                  format(value),
                  mappingData.toolRuntimeConfig
                ),
              };
            });
          })
          .flat();

        const numberOfDataSeriesSignal = spec.signals.find(
          (signal) => signal.name === "numberOfDataSeries"
        );
        numberOfDataSeriesSignal.value = itemData[0].length - 1; // the first column is not a data column, so we subtract it

        if (shouldHaveLabelsOnTopOfBar(mappingData)) {
          spec.axes[1].labels = false;

          // flush the X axis labels if we have the labels on top of the bar
          spec.axes[0].labelFlush = true;

          // align the axis alignment to the left if the labels are inside the chart
          spec.axes[1].encode.title.update.align.value = "left";

          const labelHeightSignal = spec.signals.find(
            (signal) => signal.name === "labelHeight"
          );
          labelHeightSignal.value = 16;

          // if we have a date series, we need to format the label accordingly
          // otherwise we use the exact xValue as the label
          const labelText = {};
          if (mappingData.dateFormat) {
            const d3format =
              intervals[item.options.dateSeriesOptions.interval].d3format;
            labelText.signal = `timeFormat(datum.xValue, '${intervals[d3format]}')`;
          } else {
            labelText.field = "xValue";
          }

          const labelMark = {
            type: "text",
            name: "bar-top-label",
            from: {
              data: "xValues",
            },
            encode: {
              update: {
                text: labelText,
                y: {
                  signal: "-labelHeight/2",
                },
                x: {
                  signal: 4,
                },
                baseline: {
                  value: "middle",
                },
              },
            },
          };

          // if all the values are negative, we right align the label
          const maxValue = dataHelpers.getMaxValue(itemData);
          if (maxValue <= 0) {
            labelMark.encode.update.x = { signal: "width" };
            labelMark.encode.update.align = { value: "right" };
          }

          spec.marks[0].marks[0].marks.push(labelMark);
        }
      },
    },
    {
      path: "item.options.annotations.valuesOnBars",
      mapToSpec: function (valuesOnBars, spec, mappingData) {
        if (!valuesOnBars) {
          return;
        }

        const valuePadding = 4;
        const tests = {
          positiveInBar: `datum.datum.yValue >= 0 && datum.width > datum.datum.labelWidth + ${
            valuePadding * 2
          }`,
          positiveRightOfBar: `datum.datum.yValue >= 0 && (width - datum.x2) > datum.datum.labelWidth + ${valuePadding}`,
          positiveElse: "datum.datum.yValue >= 0",
          negativeInBar: `datum.datum.yValue < 0 && datum.width > datum.datum.labelWidth + ${
            valuePadding * 2
          }`,
          negativeLeftOfBar: `datum.datum.yValue < 0 && (datum.x) > datum.datum.labelWidth + ${valuePadding}`,
          contrastFineForDark: `contrast('${mappingData.toolRuntimeConfig.text.fill}', datum.fill) > contrast('white', datum.fill)`,
        };

        const valueLabelMark = {
          type: "text",
          from: {
            data: "bar",
          },
          encode: {
            enter: {
              y: {
                field: "y",
              },
              dy: {
                signal: "(barWidth / 2) + 0.5", // Adds offset of 0.5px in order to vertically center the label within the bar
              },
              baseline: {
                value: "middle",
              },
              x: [
                {
                  test: tests.positiveInBar,
                  field: "x2",
                },
                {
                  test: tests.positiveRightOfBar,
                  field: "x2",
                },
                {
                  test: tests.positiveElse,
                  field: "x",
                },
                {
                  test: tests.negativeInBar,
                  field: "x",
                },
                {
                  test: tests.negativeLeftOfBar,
                  field: "x",
                },
                {
                  field: "x2",
                },
              ],
              align: [
                {
                  test: tests.positiveInBar,
                  value: "right",
                },
                {
                  test: tests.positiveRightOfBar,
                  value: "left",
                },
                {
                  test: tests.positiveElse,
                  value: "right",
                },
                {
                  test: tests.negativeInBar,
                  value: "left",
                },
                {
                  test: tests.negativeLeftOfBar,
                  value: "right",
                },
                {
                  value: "left",
                },
              ],
              dx: [
                {
                  test: tests.positiveInBar,
                  value: -valuePadding,
                },
                {
                  test: tests.positiveRightOfBar,
                  value: valuePadding,
                },
                {
                  test: tests.positiveElse,
                  value: -valuePadding,
                },
                {
                  test: tests.negativeInBar,
                  value: valuePadding,
                },
                {
                  test: tests.negativeLeftOfBar,
                  value: -valuePadding,
                },
                {
                  value: valuePadding,
                },
              ],
              fill: [
                {
                  test:
                    tests.positiveInBar + " && " + tests.contrastFineForDark,
                  value: mappingData.toolRuntimeConfig.text.fill,
                },
                {
                  test: tests.positiveInBar,
                  value: "white",
                },
                {
                  test:
                    tests.negativeInBar + " && " + tests.contrastFineForDark,
                  value: mappingData.toolRuntimeConfig.text.fill,
                },
                {
                  test: tests.negativeInBar,
                  value: "white",
                },
                {
                  value: mappingData.toolRuntimeConfig.text.fill,
                },
              ],
              text: {
                signal: `format(datum.datum.yValue, "${d3config.specifier}")`,
              },
            },
          },
        };

        // add the value label marks
        spec.marks[0].marks[0].marks.push(valueLabelMark);

        objectPath.set(spec, "axes.0.grid", false);
        objectPath.set(spec, "axes.0.ticks", false);
        objectPath.set(spec, "axes.0.domain", false);
        objectPath.set(spec, "axes.0.labels", false);

        // the grid and the ticks of the y axis should get hidden
        // the labels follow any settings handled before
        objectPath.set(spec, "axes.1.grid", false);
        objectPath.set(spec, "axes.1.ticks", false);

        // keep the 0 tick line only
        // hide the domain
        // do not show labels
        objectPath.set(spec, "axes.0.grid", true);
        objectPath.set(
          spec,
          "axes.0.gridColor",
          mappingData.toolRuntimeConfig.axis.labelColor
        );

        objectPath.set(spec, "axes.0.values", [0]);

        // make sure the axis is drawn on top, so it's in front of positive and negative bars
        objectPath.set(spec, "axes.0.zindex", 1);
      },
    },
    {
      path: "item.options.hideAxisLabel",
      mapToSpec: function (hideAxisLabel, spec) {
        if (
          hideAxisLabel === true ||
          !objectPath.get(spec, "axes.1.title") ||
          objectPath.get(spec, "axes.1.title").length < 1
        ) {
          // unset the x axis label
          objectPath.set(spec, "axes.1.title", undefined);
          objectPath.set(spec, "height", spec.height - 30); // decrease the height because we do not need space for the axis title
        }
      },
    },
    {
      path: "item.options.barOptions.maxValue",
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
  ]
    .concat(commonMappings.getColorOverwritesRowsMappings())
    .concat(commonMappings.getHighlightRowsMapping())
    .concat(commonMappings.getHighlightSeriesMapping())
    .concat(commonMappings.getBarDateSeriesHandlingMappings())
    .concat(commonMappings.getBarPrognosisMappings())
    .concat(commonMappings.getBarLabelColorMappings())
    .concat(commonMappings.getBarAxisPositioningMappings())
    .concat(commonMappings.getBarEventsMapping());
};
