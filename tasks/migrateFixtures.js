const fixtureDataDirectory = "../resources/fixtures/data";
var fs = require("fs");
const glob = require("glob");

// register migration scripts here in order of version,
// i.e. list the smallest version first
const migrationScripts = [require("../migration-scripts/to-v2.0.0.js")];

const fixtureFiles = glob.sync(
  `${__dirname}/../resources/fixtures/data/*.json`
);
for (let fixtureFile of fixtureFiles) {
  const fixture = require(fixtureFile);
  for (let script of migrationScripts) {
    const res = script.migrate(fixture);
    fs.writeFileSync(fixtureFile, JSON.stringify(res.item, null, 2), "utf-8");
  }
}
