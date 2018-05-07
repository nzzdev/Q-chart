module.exports = {
  name: "validation",
  register: async function(server, options) {
    server.route([].concat(require("./sources.js")));
  }
};
