const clone = require('clone');
const objectPath = require("object-path");

function getSpecWithMappedItem(item, chartType, spec, config = {}) {
  const newSpec = clone(spec);
  try {
    const mappings = require(`../chartTypes/${chartType}/mapping.js`)(config);

    for (let mapping of mappings) {
      const itemValue = objectPath.get(item, mapping.path);
      if (itemValue === undefined) {
        continue;
      }
      mapping.mapToSpec(itemValue, newSpec);
    }

    // merge(item, newSpec, require(`../chartTypes/${chartType}/mapping.js`)(config));
    // const newSpec = mapObj(item, require(`../chartTypes/${chartType}/mapping.js`)(config));
  } catch (err) {
    console.log(err);
    throw new Error(`no or no valid type mapping implemented for type ${chartType}`);
  }
  return newSpec;
}

module.exports = {
  getSpecWithMappedItem: getSpecWithMappedItem
};
