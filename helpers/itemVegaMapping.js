const clone = require('clone');
const merge = require('object-mapper');

function getSpecWithMappedItem(item, chartType, spec, config = {}) {
  const newSpec = clone(spec);
  try {
    merge(item, newSpec, require(`../chartTypes/${chartType}/mapping.js`)(config));
  } catch (err) {
    console.log(err);
    throw new Error(`no or no valid type mapping implemented for type ${chartType}`);
  }
  return newSpec;
}

module.exports = {
  getSpecWithMappedItem: getSpecWithMappedItem
};
