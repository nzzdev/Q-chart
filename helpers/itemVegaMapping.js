const clone = require("clone");
const objectPath = require("object-path");

function getSpecWithMappedItem(item, id, chartType, spec, config = {}) {
  const modifiedSpec = clone(spec);
  let mappings;
  try {
    mappings = require(`../chartTypes/${chartType}/mapping.js`)(config);
  } catch (err) {
    throw new Error(
      `no or no valid type mapping implemented for type ${chartType}`
    );
  }
  try {
    for (const mapping of mappings) {
      const itemValue = objectPath.get(item, mapping.path);
      if (itemValue === undefined) {
        continue;
      }
      mapping.mapToSpec(itemValue, modifiedSpec, item, id);
    }
  } catch (err) {
    throw err;
  }
  return modifiedSpec;
}

module.exports = {
  getSpecWithMappedItem: getSpecWithMappedItem
};
