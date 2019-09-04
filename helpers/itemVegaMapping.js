const clone = require("clone");
const objectPath = require("object-path");

async function getMappedSpec(id, chartType, spec, mappingData) {
  const modifiedSpec = clone(spec);
  let mappings;
  try {
    mappings = require(`../chartTypes/${chartType}/mapping.js`)();
  } catch (err) {
    throw new Error(
      `no or no valid type mapping implemented for type ${chartType}`
    );
  }
  try {
    for (const mapping of mappings) {
      const itemValue = objectPath.get(mappingData, mapping.path);
      if (itemValue === undefined) {
        continue;
      }
      await mapping.mapToSpec(itemValue, modifiedSpec, mappingData, id);
    }
  } catch (err) {
    throw err;
  }
  return modifiedSpec;
}

module.exports = {
  getMappedSpec: getMappedSpec
};
