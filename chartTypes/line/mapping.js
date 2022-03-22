const clone = require("clone");
const objectPath = require("object-path");
const intervals = require("../../helpers/dateSeries.js").intervals;
const dateSeries = require("../../helpers/dateSeries.js");
const dataHelpers = require("../../helpers/data.js");
const { convertDateObjectsToTimestamps } = require("../../helpers/events.js");

const commonMappings = require("../commonMappings.js");

const annotation = require("./annotation.js");

const d3 = {
  array: require("d3-array"),
};

module.exports = function getMappings() {
  return [
    {
      path: "item.data",
      mapToSpec: function (itemData, spec, mappingData) {
        // set the x axis title
        objectPath.set(spec, "axes.0.title", itemData[0][0]);

        // check if we need to shorten the number labels
        const divisor = dataHelpers.getDivisor(
          itemData,
          mappingData.item.options.largeNumbers
        );

        spec.data = [
          {
            name: "table",
            values: clone(itemData)
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
                  };
                });
              })
              .flat(),
          },
        ];
      },
    },
    {
      path: "item.options.annotations",
      mapToSpec: function (annotationOptions, spec, mappingData) {
        const item = mappingData.item;
        // this option is only available if we have exactly one data series
        if (item.data[0].length !== 2) {
          return;
        }

        const sortedValues = spec.data[0].values.slice(0).sort((a, b) => {
          return a.yValue - b.yValue;
        });

        const firstValue = spec.data[0].values[0];
        const secondValue = spec.data[0].values[1];
        const lastValue = spec.data[0].values[spec.data[0].values.length - 1];
        const secondLastValue =
          spec.data[0].values[spec.data[0].values.length - 2];

        const maxValue = sortedValues.pop();
        const minValue = sortedValues.shift();

        const valuesToAnnotate = [
          {
            optionName: "first",
            value: firstValue,
            dataName: "onlyFirst",
            align: "left",
            verticalAlign:
              firstValue.yValue > secondValue.yValue &&
              !item.options.lineChartOptions.reverseYScale
                ? "top"
                : "bottom",
          },
          {
            optionName: "last",
            value: lastValue,
            dataName: "onlyLast",
            align: "right",
            verticalAlign:
              lastValue.yValue > secondLastValue.yValue &&
              !item.options.lineChartOptions.reverseYScale
                ? "top"
                : "bottom",
          },
          {
            optionName: "max",
            value: maxValue,
            dataName: "onlyMax",
            align:
              maxValue.xValue.toString() === firstValue.xValue.toString()
                ? "left"
                : maxValue.xValue.toString() === lastValue.xValue.toString()
                ? "right"
                : "center",
            verticalAlign: !item.options.lineChartOptions.reverseYScale
              ? "top"
              : "bottom",
          },
          {
            optionName: "min",
            value: minValue,
            dataName: "onlyMin",
            align:
              minValue.xValue.toString() === firstValue.xValue.toString()
                ? "left"
                : minValue.xValue.toString() === lastValue.xValue.toString()
                ? "right"
                : "center",
            verticalAlign: !item.options.lineChartOptions.reverseYScale
              ? "bottom"
              : "top",
          },
        ]
          .filter((annotation) => {
            return annotationOptions[annotation.optionName] === true;
          })
          .reduce((annotations, testAnnotation) => {
            // make the annotations unique by xValue
            if (
              !annotations.find((annotation) => {
                return (
                  testAnnotation.value.xValue.toString() ===
                  annotation.value.xValue.toString()
                );
              })
            ) {
              annotations.push(testAnnotation);
            }
            return annotations;
          }, []);

        for (const valueToAnnotate of valuesToAnnotate) {
          objectPath.push(spec, "data", {
            name: valueToAnnotate.dataName,
            values: [valueToAnnotate.value],
          });

          const symbol = annotation.getSymbol(valueToAnnotate.dataName);
          const label = annotation.getLabel(
            valueToAnnotate.dataName,
            valueToAnnotate.align,
            valueToAnnotate.verticalAlign
          );
          objectPath.push(spec, "marks", symbol);
          objectPath.push(spec, "marks", label);
        }
      },
    },
    {
      path: "item.options.yScaleType",
      mapToSpec: function (yScaleType, spec) {
        objectPath.set(spec, "scales.1.type", yScaleType);

        // Log scales must have a min value that is non-zero.
        // If no minValue is set for the y-axis we will set it to 1 here,
        // otherwise the linechart will be misdrawn and the user will be confused.
        if (spec.scales[1].domainMin === undefined) {
          objectPath.set(spec, "scales.1.domainMin", 1);
        }
      },
    },
    {
      path: "item.options.hideAxisLabel",
      mapToSpec: function (hideAxisLabel, spec) {
        if (
          hideAxisLabel === true ||
          typeof objectPath.get(spec, "axes.0.title") !== "string" ||
          objectPath.get(spec, "axes.0.title").length < 1
        ) {
          // unset the x axis label
          objectPath.set(spec, "axes.0.title", undefined);
          objectPath.set(spec, "height", spec.height - 20); // decrease the height because we do not need space for the axis title
        }
      },
    },
    {
      path: "item.options.lineChartOptions.minValue",
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

        objectPath.set(spec, "scales.1.nice", false);
        objectPath.set(spec, "scales.1.domainMin", minValue / divisor);
      },
    },
    {
      path: "item.options.lineChartOptions.maxValue",
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

        objectPath.set(spec, "scales.1.nice", false);
        objectPath.set(spec, "scales.1.domainMax", maxValue / divisor);
      },
    },
    {
      path: "item.options.lineChartOptions.yAxisTicks",
      mapToSpec: function (values, spec, mappingData) {
        if (values.length === 0) {
          values = undefined;
        } else {
          values = values.split(",");
        }

        objectPath.set(spec, "axes.1.values", values);
      }
    },
    {
      path: "item.options.lineChartOptions.reverseYScale",
      mapToSpec: function (reverseYScale, spec) {
        if (reverseYScale === true) {
          objectPath.set(spec, "scales.1.reverse", true);
        }
      },
    },
    {
      path: "item.options.lineChartOptions.lineInterpolation",
      mapToSpec: function (interpolation, spec) {
        if (interpolation) {
          objectPath.set(
            spec,
            "marks.0.marks.0.encode.enter.interpolate.value",
            interpolation
          );
          objectPath.set(
            spec,
            "marks.0.marks.1.encode.enter.interpolate.value",
            interpolation
          );
        }
      },
    },
    {
      path: "item.options.dateSeriesOptions.prognosisStart",
      mapToSpec: function (prognosisStart, spec, mappingData) {
        if (prognosisStart === null) {
          return;
        }
        // add the signal
        objectPath.push(spec, "signals", {
          name: "prognosisStartDate",
          value: dateSeries.getPrognosisStartDate(
            mappingData.originalItemData,
            prognosisStart
          ),
        });

        // split the marks at the prognosisStart index
        const beforePrognosisDate =
          "datum.yValue !== null && datum.xValue <= prognosisStartDate";
        const lineMarkHighlight = clone(spec.marks[0].marks[0]);
        const lineMark = clone(spec.marks[0].marks[1]);
        lineMarkHighlight.encode.enter.defined = {
          signal: beforePrognosisDate,
        };
        lineMark.encode.enter.defined = {
          signal: beforePrognosisDate,
        };

        const afterPrognosisDate =
          "datum.yValue !== null && datum.xValue >= prognosisStartDate";
        const lineMarkPrognosisHighlight = clone(spec.marks[0].marks[0]);
        const lineMarkPrognosis = clone(spec.marks[0].marks[1]);
        lineMarkPrognosisHighlight.encode.enter.defined = {
          signal: afterPrognosisDate,
        };
        lineMarkPrognosis.encode.enter.defined = {
          signal: afterPrognosisDate,
        };
        lineMarkPrognosisHighlight.style = "prognosisLine";
        lineMarkPrognosis.style = "prognosisLine";
        spec.marks[0].marks = [
          lineMarkHighlight,
          lineMark,
          lineMarkPrognosisHighlight,
          lineMarkPrognosis,
        ];
      },
    },
    {
      path: "item.options.lineChartOptions.isStockChart",
      mapToSpec: function (isStockChart, spec, mappingData) {
        const item = mappingData.item;
        if (!isStockChart) {
          return;
        }

        // keep the defined interval
        const interval = mappingData.item.options.dateSeriesOptions.interval;

        // unset, we do not want any date series handling in this case
        mappingData.item.options.dateSeriesOptions = undefined;

        // if the option for (intraday) stock is set
        // we do not use a time scale as this would look weird
        // because there is no data during the night when stock exchanges are closed
        objectPath.set(spec, "scales.0.type", "point");

        // set the values to timestamps instead of date objects
        objectPath.set(
          spec,
          "data.0.values",
          objectPath.get(spec, "data.0.values").map((row) => {
            row.xValue = row.xValue.valueOf();
            return row;
          })
        );
        // Also use timestamps for events
        convertDateObjectsToTimestamps(item.events);

        objectPath.set(spec, "axes.0.labelFlush", true);

        const { first, last } = dateSeries.getFirstAndLastDateFromData(
          mappingData.item.data
        );

        objectPath.set(spec, "axes.0.values", [
          first.valueOf(),
          last.valueOf(),
        ]);

        // the axis tick values should be formatted according to the selected interval
        objectPath.set(spec, "axes.0.encode.labels.update.text", {
          signal: `formatDateForInterval(datum.value, '${interval}')`,
        });
      },
    },
  ]
    .concat(commonMappings.getLineDateSeriesHandlingMappings())
    .concat(commonMappings.getHeightMappings())
    .concat(commonMappings.getHighlightSeriesMapping())
    .concat(commonMappings.getColumnEventsMapping());
};
