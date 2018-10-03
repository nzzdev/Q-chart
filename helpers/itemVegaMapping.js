const clone = require("clone");
const objectPath = require("object-path");

function getMappedSpec(id, chartType, spec, renderingInfoInput) {
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
      const itemValue = objectPath.get(renderingInfoInput, mapping.path);
      if (itemValue === undefined) {
        continue;
      }
      mapping.mapToSpec(itemValue, modifiedSpec, renderingInfoInput, id);
    }
  } catch (err) {
    throw err;
  }
  return modifiedSpec;
}

module.exports = {
  getMappedSpec: getMappedSpec
};
