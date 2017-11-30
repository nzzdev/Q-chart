const clone = require('clone');
const merge = require('object-mapper');

function getSpecWithMappedItem(item, spec) {
  const newSpec = clone(spec);
  try {
    merge(item, newSpec, require(`../chartTypes/${item.options.chartType.toLowerCase()}/mapping.js`));
  } catch (err) {
    throw new Error(`no type mapping implemented for type ${item.options.chartType}`);
  }
  return newSpec;
}

module.exports = {
  getSpecWithMappedItem: getSpecWithMappedItem
};
