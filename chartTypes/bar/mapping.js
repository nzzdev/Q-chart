const clone = require('clone');
const objectPath = require('object-path');

const getLongestDataLabel = require('../../helpers/data.js').getLongestDataLabel;
const textMetrics = require('vega').textMetrics;

let labelsOnTopOfBars;

function shouldHaveLabelsOnTopOfBar(itemData, config) {
  if (labelsOnTopOfBars !== undefined) {
    return labelsOnTopOfBars;
  }

  const longestLabel = getLongestDataLabel(itemData, true);
  const item = {
    text: longestLabel
  };
  const longestLabelWidth = textMetrics.width(item);
  
  if (config.width / 3 < longestLabelWidth) {
    labelsOnTopOfBars = true;
  } else {
    labelsOnTopOfBars = false;
  }

  return labelsOnTopOfBars;
}

module.exports = function getMapping(config = {}) {
  // reset
  labelsOnTopOfBars = undefined;
  return [
    {
      path: 'data',
      mapToSpec: function(itemData, spec) {
        spec.data = {
          name: 'table',
          values: clone(itemData)
            .slice(1)                     // take the header row out of the array
            .map((row, rowIndex) => {
              const y = row.shift();      // take the y axis value out of the row
              return row
                .map((val, index) => {    // generate one array entry for every data category on the same y value
                  return {
                    xValue: val,
                    xIndex: rowIndex,
                    yValue: y,
                    cValue: index
                  }
                })
            })
            .reduce(( acc, cur ) => {     // flatten the array
              return acc.concat(cur);
            })
        }
      }
    },
    {
      path: 'data',
      mapToSpec: function(itemData, spec) {
        const numberOfCategories = itemData[1].length;
        const numberOfGroups = itemData.length - 1; // minus the header row
        // minimum 10px height for bars
        let height = (numberOfCategories * numberOfGroups * 10);
        // add the padding
        height += height / (numberOfGroups) * spec.scales[1].paddingInner * (numberOfGroups - 1);

        // add some space for the labels and axis title if any
        height += 40;

        spec.height = height;
      }
    },
    {
      path: 'data.0.0',
      mapToSpec: function(firstColumnFirstRow, spec) {
        objectPath.set(spec, 'axes.0.title', firstColumnFirstRow);
      }
    },
    {
      path: 'data',
      mapToSpec: function(itemData) {
        // return !shouldHaveLabelsOnTopOfBar(itemData, config);
      }
    },
    {
      path: 'data',
      mapToSpec: function(itemData) {
        // if (shouldHaveLabelsOnTopOfBar(itemData, config)) {
          // todo: adjust spec to have labels on top of bar group
        // };
      }
    }
  ]
};
