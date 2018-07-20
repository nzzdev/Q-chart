const configuredDivergingColorSchemes = require('../colorSchemes.js').getConfiguredDivergingColorSchemes();
const vega = require('vega');

function getColorSchemeName(item) {
  let itemColorScheme;
  try {
    itemColorScheme = configuredDivergingColorSchemes[item.options.arrowOptions.colorScheme].scheme_name;
  } catch (e) {
    itemColorScheme = null;
  }
  return itemColorScheme;
}

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
  let firstLabel = item.data[0][1];
  let lastLabel = item.data[0][2];

  const colorSchemeName = getColorSchemeName(item);

  if (hasOnlyPositiveChanges(item)) {
    if (colorSchemeName) {
      arrowColor = toolRuntimeConfig.colorSchemes[getColorSchemeName(item)][3][2];
    } else {
      arrowColor = vega.schemeDiscretized('redblue')[3][2];
    }
  } else if (hasOnlyNegativeChanges(item)) {
    if (colorSchemeName) {
      arrowColor = toolRuntimeConfig.colorSchemes[getColorSchemeName(item)][3][0];
    } else {
      arrowColor = vega.schemeDiscretized('redblue')[3][0];
    }
    // rotate the arrow to point to the left
    arrowTranslate = "rotate(180 14.5 5.5)";
    // and switch the labels
    firstLabel = item.data[0][1];
    lastLabel = item.data[0][2];
  }
  
  return {
    legendItems: [
      {
        elements: [
          {
            label: firstLabel
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
            label: lastLabel
          }
        ]
      }
    ]
  };
}

module.exports = {
  getLegendModel: getLegendModel
};
