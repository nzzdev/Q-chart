const clone = require("clone");
const objectPath = require("object-path");
const intervals = require("../../helpers/dateSeries.js").intervals;
const dataHelpers = require("../../helpers/data.js");

const commonMappings = require("../commonMappings.js");

const annotation = require("./annotation.js");

const d3 = {
  array: require("d3-array")
};

module.exports = function getMappings() {
  return [
    {
      path: "item.data",
      mapToSpec: function(itemData, spec) {
        // set the x axis title
        objectPath.set(spec, "axes.0.title", itemData[0][0]);

        // check if we need to shorten the number labels
        const divisor = dataHelpers.getDivisor(itemData);

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
                    cValue: index
                  };
                });
              })
              .reduce((acc, cur) => {
                // flatten the array
                return acc.concat(cur);
              }, [])
          }
        ];
      }
    },
    {
      path: "toolRuntimeConfig.displayOptions.size",
      mapToSpec: function(size, spec) {
        let height;
        if (size === "prominent") {
          // Aspect ratio 16:9
          height = spec.width * (9 / 16);
          if (height < 240) {
            height = 240;
          }
          objectPath.set(spec, "height", height);
        } else {
          // Aspect ratio 7:3
          height = spec.width * (3 / 7);
          if (height < 240) {
            height = 240;
          }
          objectPath.set(spec, "height", height);
        }
      }
    },
    {
      path: "item.options.annotations",
      mapToSpec: function(annotationOptions, spec, renderingInfoInput) {
        const item = renderingInfoInput.item;
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
                : "bottom"
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
                : "bottom"
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
              : "bottom"
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
              : "top"
          }
        ]
          .filter(annotation => {
            return annotationOptions[annotation.optionName] === true;
          })
          .reduce((annotations, testAnnotation) => {
            // make the annotations unique by xValue
            if (
              !annotations.find(annotation => {
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
            values: [valueToAnnotate.value]
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
      path: "item.options.lineChartOptions.minValue",
      mapToSpec: function(minValue, spec, renderingInfoInput) {
        // check if we need to shorten the number labels
        const divisor = dataHelpers.getDivisor(renderingInfoInput.item.data);

        const dataMinValue = dataHelpers.getMinValue(
          renderingInfoInput.item.data
        );
        if (dataMinValue < minValue) {
          minValue = dataMinValue;
        }

        objectPath.set(spec, "scales.1.nice", false);
        objectPath.set(spec, "scales.1.domainMin", minValue / divisor);
      }
    },
    {
      path: "item.options.lineChartOptions.maxValue",
      mapToSpec: function(maxValue, spec, renderingInfoInput) {
        // check if we need to shorten the number labels
        const divisor = dataHelpers.getDivisor(renderingInfoInput.item.data);

        const dataMaxValue = dataHelpers.getMaxValue(
          renderingInfoInput.item.data
        );
        if (dataMaxValue > maxValue) {
          maxValue = dataMaxValue;
        }

        objectPath.set(spec, "scales.1.nice", false);
        objectPath.set(spec, "scales.1.domainMax", maxValue / divisor);
      }
    },
    {
      path: "item.options.lineChartOptions.reverseYScale",
      mapToSpec: function(reverseYScale, spec) {
        if (reverseYScale === true) {
          objectPath.set(spec, "scales.1.reverse", true);
        }
      }
    },
    {
      path: "item.options.lineChartOptions.lineInterpolation",
      mapToSpec: function(interpolation, spec) {
        if (interpolation) {
          objectPath.set(
            spec,
            "marks.0.marks.0.encode.enter.interpolate.value",
            interpolation
          );
        }
      }
    },
    {
      path: "item.options.dateSeriesOptions.prognosisStart",
      mapToSpec: function(prognosisStart, spec) {
        if (prognosisStart === null) {
          return;
        }
        // add the signal
        objectPath.push(spec, "signals", {
          name: "prognosisStart",
          value: prognosisStart
        });

        // split the marks at the prognosisStart index
        const lineMark = clone(spec.marks[0].marks[0]);
        lineMark.encode.enter.defined = {
          signal: "datum.yValue !== null && datum.xIndex <= prognosisStart"
        };
        const lineMarkPrognosis = clone(spec.marks[0].marks[0]);
        lineMarkPrognosis.encode.enter.defined = {
          signal: "datum.yValue !== null && datum.xIndex >= prognosisStart"
        };
        lineMarkPrognosis.style = "prognosisLine";
        spec.marks[0].marks = [lineMark, lineMarkPrognosis];
      }
    },
    {
      path: "item.options.lineChartOptions.isStockChart",
      mapToSpec: function(isStockChart, spec, renderingInfoInput) {
        const item = renderingInfoInput.item;
        if (!isStockChart) {
          return;
        }

        // if the option for (intraday) stock is set
        // we do not use a time scale as this would look weird
        // because there is no data during the night when stock exchanges are closed
        // therefor we need to do some manual date wrangling to have the labels in the correct format

        const d3format =
          intervals[item.options.dateSeriesOptions.interval].d3format;

        // format the labels for the X axis according to the interval d3format
        spec.axes[0].encode = Object.assign({}, spec.axes[0].encode, {
          labels: {
            update: {
              text: {
                signal: `timeFormat(timeParse(datum.value, "%Y-%m-%dT%H:%M:%S.%L%Z"), '${
                  intervals[item.options.dateSeriesOptions.interval].d3format
                }')`
              }
            }
          }
        });

        const dates = item.data
          .slice(0)
          .slice(1) // return header row
          .map(row => {
            return row[0];
          });

        // just show first and last date for now
        // todo: this should be more intelligent in calculating the ticks
        objectPath.set(
          spec,
          "axes.0.values",
          d3.array.extent(dates).map(date => date.toISOString())
        );

        objectPath.set(
          spec,
          "data.0.values",
          spec.data[0].values.map(value => {
            value.xValue = value.xValue.toISOString();
            return value;
          })
        );

        objectPath.set(spec, "data.0.parse", {
          format: "date:%Y-%m-%dT%H:%M:%S.%L%Z"
        });

        objectPath.set(spec, "axes.0.labelOverlap", "parity"); // use parity label overlap strategy if we have a date series
      }
    }
  ].concat(commonMappings.getLineDateSeriesHandlingMappings());
};
