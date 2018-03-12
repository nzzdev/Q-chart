const objectPath = require("object-path");
const array2d = require("array2d");
const clone = require("clone");
const dataHelpers = require("../../helpers/data.js");

const getLongestDataLabel = require("../../helpers/data.js")
  .getLongestDataLabel;
const textMetrics = require("vega").textMetrics;

function shouldHaveLabelsOnTopOfBar(itemData, config) {
  const longestLabel = getLongestDataLabel(itemData, true);
  const item = {
    text: longestLabel
  };
  const longestLabelWidth = textMetrics.width(item);

  if (config.width / 3 < longestLabelWidth) {
    return true;
  }
  return false;
}

module.exports = function getMapping(config = {}) {
  return [
    {
      path: "data",
      mapToSpec: function(itemData, spec) {
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
          .reduce((acc, cur) => {
            // flatten the array
            return acc.concat(cur);
          }, []);

        const numberOfDataSeriesSignal = spec.signals.find(
          signal => signal.name === "numberOfDataSeries"
        );
        numberOfDataSeriesSignal.value = itemData[0].length - 1; // the first column is not a data column, so we subtract it

        if (shouldHaveLabelsOnTopOfBar(itemData, config)) {
          spec.axes[1].labels = false;

          const labelHeightSignal = spec.signals.find(
            signal => signal.name === "labelHeight"
          );
          labelHeightSignal.value = 25;

          spec.marks[0].marks[0].marks.push({
            type: "text",
            from: {
              data: "xValues"
            },
            encode: {
              update: {
                text: {
                  field: "xValue"
                },
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
    }
  ];
};

// module.exports = function getMapping(config = {}) {
//   // reset
//   labelsOnTopOfBars = undefined;
//   return [
//     {
//       path: 'data',
//       mapToSpec: function(itemData, spec) {
//         spec.data = {
//           name: 'table',
//           values: clone(itemData)
//             .slice(1)                     // take the header row out of the array
//             .map((row, rowIndex) => {
//               const y = row.shift();      // take the y axis value out of the row
//               return row
//                 .map((val, index) => {    // generate one array entry for every data category on the same y value
//                   return {
//                     xValue: val,
//                     xIndex: rowIndex,
//                     yValue: y,
//                     cValue: index
//                   }
//                 })
//             })
//             .reduce(( acc, cur ) => {     // flatten the array
//               return acc.concat(cur);
//             })
//         }
//       }
//     },
//     {
//       path: 'data',
//       mapToSpec: function(itemData, spec) {
//         const numberOfCategories = itemData[1].length;
//         const numberOfGroups = itemData.length - 1; // minus the header row
//         // minimum 10px height for bars
//         let height = (numberOfCategories * numberOfGroups * 10);
//         // add the padding
//         height += height / (numberOfGroups) * spec.scales[1].paddingInner * (numberOfGroups - 1);

//         // add some space for the labels and axis title if any
//         height += 40;

//         spec.height = height;
//       }
//     },
//     {
//       path: 'data.0.0',
//       mapToSpec: function(firstColumnFirstRow, spec) {
//         objectPath.set(spec, 'axes.0.title', firstColumnFirstRow);
//       }
//     },
//     {
//       path: 'data',
//       mapToSpec: function(itemData) {
//         // return !shouldHaveLabelsOnTopOfBar(itemData, config);
//       }
//     },
//     {
//       path: 'data',
//       mapToSpec: function(itemData) {
//         // if (shouldHaveLabelsOnTopOfBar(itemData, config)) {
//           // todo: adjust spec to have labels on top of bar group
//         // };
//       }
//     }
//   ]
// };
