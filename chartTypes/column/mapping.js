const objectPath = require("object-path");
const clone = require("clone");
const dataHelpers = require("../../helpers/data.js");
const d3config = require("../../config/d3.js");
const d3Format = require("d3-format");

const commonMappings = require("../commonMappings.js");

const textMeasure = require("../../helpers/textMeasure.js");

const vega = require("vega");

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
    }
  ]
    .concat(commonMappings.getColorOverwritesRowsMappings())
    .concat(commonMappings.getHighlightRowsMapping())
    .concat(commonMappings.getHighlightSeriesMapping())
    .concat(commonMappings.getColumnDateSeriesHandlingMappings())
    .concat(commonMappings.getColumnAreaPrognosisMappings())
    .concat(commonMappings.getColumnLabelColorMappings())
    .concat(commonMappings.getHeightMappings())
    .concat(commonMappings.getColumnAxisPositioningMappings())
    .concat([
      {
        path: "item.options.annotations.valuesOnBars",
        mapToSpec: async function(valuesOnBars, spec, mappingData) {
          if (!valuesOnBars) {
            return;
          }

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
          const longestColumnLabelWidth = textMeasure.getLabelTextWidth(
            d3Format
              .formatLocale(d3config.formatLocale)
              .format(labelsSortedByLength[0]),
            mappingData.toolRuntimeConfig
          );

          let availableSpace;
          try {
            // let vega calculate the view once here, to be able to get the actual column width
            const dataflow = vega.parse(spec);
            const view = new vega.View(dataflow).renderer("svg").initialize();
            await view.runAsync();
            const state = view.getState();

            const binnedColumnWidth =
              state.subcontext[0].signals.binnedColumnWidth;

            availableSpace = binnedColumnWidth;

            if (view.signal("numberOfDataSeries") === 1) {
              // if there is only one data series, we take 2/3 of the group margin to the available space
              // 2/3 because there is 1/2 of the margin on each side of the column, but we do not take the complete space to ensure some space between labels
              if (state.subcontext[0].signals.columnMargin) {
                availableSpace +=
                  (state.subcontext[0].signals.columnMargin * 2) / 3;
              }
            }
          } catch (e) {
            // if we can't take the binnedColumnWidth from the state, we will not apply this config option
          }

          if (availableSpace === undefined || Number.isNaN(availableSpace)) {
            return;
          }

          // if the column is less wide than the longestLabel, we do not apply this option
          if (availableSpace < longestColumnLabelWidth) {
            return;
          }

          const valuePadding = 4;
          const valueLabelMark = {
            type: "text",
            from: {
              data: "bar"
            },
            encode: {
              enter: {
                y: [
                  {
                    test: "datum.datum.yValue >= 0",
                    signal: `datum.y - ${valuePadding}`
                  },
                  {
                    signal: `datum.y2 + ${valuePadding}`
                  }
                ],
                baseline: [
                  {
                    test: "datum.datum.yValue >= 0",
                    value: "bottom"
                  },
                  {
                    value: "top"
                  }
                ],
                x: {
                  signal: "datum.x + (datum.width / 2)"
                },
                fill: [
                  {
                    value: mappingData.toolRuntimeConfig.text.fill
                  }
                ],
                text: {
                  signal: `format(datum.datum.yValue, "${d3config.specifier}")`
                },
                align: {
                  value: "center"
                }
              }
            }
          };

          // add the value label marks
          spec.marks[0].marks.push(valueLabelMark);

          objectPath.set(spec, "axes.1.grid", false);
          objectPath.set(spec, "axes.1.domain", false);
          objectPath.set(spec, "axes.1.ticks", false);
          objectPath.set(spec, "axes.1.labels", false);

          objectPath.set(spec, "axes.0.grid", false);
          objectPath.set(spec, "axes.0.ticks", false);
          objectPath.set(spec, "axes.0.labels", true);

          // keep the 0 tick line only
          // hide the domain
          // do not show labels
          objectPath.set(spec, "axes.1.grid", true);
          objectPath.set(
            spec,
            "axes.1.gridColor",
            mappingData.toolRuntimeConfig.axis.labelColor
          );
          objectPath.set(spec, "axes.1.values", [0]);

          // add some offset to have space between the bottom placed labels on the bar and the axis labels
          objectPath.set(spec, "axes.0.offset", 10);

          // make sure the axis is drawn on top, so it's in front of positive and negative bars
          objectPath.set(spec, "axes.1.zindex", 1);
        }
      }
    ]);
};
