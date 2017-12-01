const clone = require('clone');
const merge = require('object-mapper');

function getSpecWithMappedItem(item, chartType, spec) {
  const newSpec = clone(spec);
  try {
    merge(item, newSpec, require(`../chartTypes/${chartType}/mapping.js`));
  } catch (err) {
    throw new Error(`no type mapping implemented for type ${item.options.chartType}`);
  }
  return newSpec;
}

module.exports = {
  getSpecWithMappedItem: getSpecWithMappedItem
};
