const objectPath = require("object-path");
const clone = require("clone");
const dataHelpers = require("../../helpers/data.js");
const d3config = require("../../config/d3.js");

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
    },
    {
      path: "item.options.annotations.valuesOnBars",
      mapToSpec: function(valuesOnBars, spec, mappingData) {
        if (!valuesOnBars) {
          return;
        }

        // One idea to limit the chance of overlapping was to limit it to 10 dataseries
        // as we measure now, this is not needed. The code stays here for reference
        // only show values if max 10 columns (to have less chance of overlapping)

        // const numberOfDataSeriesSignal = spec.signals.find(
        //   signal => signal.name === "numberOfDataSeries"
        // );
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
        const longestColumnLabelWidth = textMeasure.getLabelTextWidth(
          labelsSortedByLength[0],
          mappingData.toolRuntimeConfig
        );

        let availableSpace;
        try {
          // let vega calculate the view once here, to be able to get the actual column width
          const dataflow = vega.parse(spec);
          const view = new vega.View(dataflow).renderer("none").initialize();
          view.run();
          const columnWidth = view.getState().subcontext[0].signals
            .binnedColumnWidth;

          availableSpace = columnWidth;

          if (view.signal("numberOfDataSeries") === 1) {
            // if there is only one data series, we take 2/3 of the group margin to the available space
            // 2/3 because there is 1/2 of the margin on each side of the column, but we do not take the complete space to ensure some space between labels
            availableSpace +=
              (view.getState().subcontext[0].signals.groupMargin * 2) / 3;
          }
        } catch (e) {
          // if we can't take the columnWidth from the state, we will not apply this config option
        }

        if (availableSpace === undefined) {
          return;
        }

        // if the column is less wide than the longestLabel, we do not apply this option
        if (availableSpace < longestColumnLabelWidth) {
          return;
        }

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
              text: {
                signal: `format(datum.datum.yValue, "${d3config.formatLocale.decimal}")`
              },
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
