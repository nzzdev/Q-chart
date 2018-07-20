const fs = require("fs");
const resourcesDir = `${__dirname}/../resources/`;

const schema = JSON.parse(
  fs.readFileSync(`${resourcesDir}schema.json`, { encoding: "utf-8" })
);

try {
  const divergingColorSchemes = JSON.parse(process.env.DIVERGING_COLOR_SCHEMES);
  schema.properties.options.properties.arrowOptions.properties.colorScheme.enum = divergingColorSchemes.map(scheme => scheme.key);
  schema.properties.options.properties.arrowOptions.properties.colorScheme[
    "Q:options"
  ].enum_titles = divergingColorSchemes.map(scheme => scheme.label);
} catch (e) {
  // ignore error, we just do not have any options to choose from
}

module.exports = schema;
