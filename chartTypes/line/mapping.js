const clone = require("clone");
const objectPath = require("object-path");
const intervals = require("../../helpers/dateSeries.js").intervals;
const dataHelpers = require("../../helpers/data.js");

const commonMappings = require("../commonMappings.js");

const annotation = require("./annotation.js");

module.exports = function getMappings(config = {}) {
  return [
    {
      path: "data",
      mapToSpec: function(itemData, spec, item) {
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
      path: "options.annotations",
      mapToSpec: function(annotationOptions, spec, item) {
        const sortedValues = spec.data[0].values.slice(0).sort((a, b) => {
          return a.yValue - b.yValue;
        });

        const firstValue = spec.data[0].values.slice(0).shift();
        const lastValue = spec.data[0].values.slice(0).pop();
        const maxValue = sortedValues.pop();
        const minValue = sortedValues.shift();

        const valuesToAnnotate = [
          {
            optionName: "first",
            value: firstValue,
            dataName: "onlyFirst",
            align: "left",
            baseline: "top"
          },
          {
            optionName: "last",
            value: lastValue,
            dataName: "onlyLast",
            align: "right",
            baseline: "top"
          },
          {
            optionName: "max",
            value: maxValue,
            dataName: "onlyMax",
            align: "center",
            baseline: "top"
          },
          {
            optionName: "min",
            value: minValue,
            dataName: "onlyMin",
            align: "center",
            baseline: "bottom"
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
            valueToAnnotate.baseline
          );
          objectPath.push(spec, "marks", symbol);
          objectPath.push(spec, "marks", label);
        }
      }
    },
    {
      path: "options.hideAxisLabel",
      mapToSpec: function(hideAxisLabel, spec, item) {
        if (hideAxisLabel === true) {
          // unset the x axis label
          objectPath.set(spec, "axes.0.title", undefined);
          objectPath.set(spec, "height", spec.height - 20); // decrease the height because we do not need space for the axis title
        }
      }
    },
    {
      path: "options.lineChartOptions.minValue",
      mapToSpec: function(minValue, spec, item) {
        // check if we need to shorten the number labels
        const divisor = dataHelpers.getDivisor(item.data);

        const dataMinValue = dataHelpers.getMinValue(item.data);
        if (dataMinValue < minValue) {
          minValue = dataMinValue;
        }

        objectPath.set(spec, "scales.1.nice", false);
        objectPath.set(spec, "scales.1.domainMin", minValue / divisor);
      }
    },
    {
      path: "options.lineChartOptions.maxValue",
      mapToSpec: function(maxValue, spec, item) {
        // check if we need to shorten the number labels
        const divisor = dataHelpers.getDivisor(item.data);

        const dataMaxValue = dataHelpers.getMaxValue(item.data);
        if (dataMaxValue > maxValue) {
          maxValue = dataMaxValue;
        }

        objectPath.set(spec, "scales.1.nice", false);
        objectPath.set(spec, "scales.1.domainMax", maxValue / divisor);
      }
    },
    {
      path: "options.lineChartOptions.reverseYScale",
      mapToSpec: function(reverseYScale, spec, item) {
        if (reverseYScale === true) {
          objectPath.set(spec, "scales.1.reverse", true);
        }
      }
    },
    {
      path: "options.lineChartOptions.lineInterpolation",
      mapToSpec: function(interpolation, spec, item) {
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
      path: "options.dateSeriesOptions.prognosisStart",
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
    }
  ].concat(commonMappings.getLineDateSeriesHandlingMappings(config));
};
