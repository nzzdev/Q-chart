const clone = require("clone");
const dateSeries = require("../dateSeries.js");
const d3config = require("../../config/d3.js");
const d3timeFormat = require("d3-time-format");
const vegaConfigHelpers = require("../vegaConfig.js");

function hasOnlyPositiveChanges(item) {
  for (let row of item.data.slice(1)) { // loop over rows except header
    if (row[1] > row[2]) {              // if the first value is > than the 2nd, we do not have only positive changes
      return false;
    }
  }
  return true;
}

function hasOnlyNegativeChanges(item) {
  for (let row of item.data.slice(1)) { // loop over rows except header
    if (row[2] > row[1]) {              // if the 2nd value is > than the first, we do not have only positive changes
      return false;
    }
  }
  return true;
}

function getLegendModel(item, toolRuntimeConfig) {
  // this only works if we have exactly two data columns
  if (item.data[0].length !== 3) {
    return null;
  }

  let arrowColor = '#6E6E7E'; // the default gray
  let arrowTranslate = '';
  if (hasOnlyPositiveChanges(item)) {
    arrowColor = toolRuntimeConfig.colorSchemes['diverging-one']['3'][2];
  } else if (hasOnlyNegativeChanges(item)) {
    arrowColor = toolRuntimeConfig.colorSchemes['diverging-one']['3'][0];
    arrowTranslate = "rotate(180 14.5 5.5)";
  }
  
  return {
    legendItems: [
      {
        elements: [
          {
            label: item.data[0][1]
          },
          {
            iconSvg: `<svg xmlns="http://www.w3.org/2000/svg" width="29" height="12" viewBox="0 0 29 12">
                        <g fill="none" fill-rule="evenodd" transform="translate(1 .5) ${arrowTranslate}">
                          <polyline stroke="${arrowColor}" stroke-width="2" points="18.783 7.783 23.85 2.717 28.917 7.783" transform="rotate(90 23.533 5.25)"/>
                          <path stroke="${arrowColor}" stroke-width="2" d="M2,5.5 L26,5.5"/>
                          <circle cx="3.5" cy="5.5" r="3.5" fill="${arrowColor}" stroke="#FFF"/>
                        </g>
                      </svg>`
          },
          {
            label: item.data[0][2]
          }
        ]
      }
    ]
  };
}

module.exports = {
  getLegendModel: getLegendModel
};
