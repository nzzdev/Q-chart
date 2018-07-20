const resourcesDir = `${__dirname}/../resources/`;

const schema = require(`${resourcesDir}dynamicSchema.js`);
const schemaString = JSON.stringify(schema);

module.exports = [
  {
    method: "GET",
    path: "/schema.json",
    handler: function(request, h) {
      return h.response(schemaString).type("application/json");
    }
  },
  {
    method: "GET",
    path: "/display-options-schema.json",
    handler: function(request, h) {
      return h.file(`${resourcesDir}display-options-schema.json`);
    }
  }
];
