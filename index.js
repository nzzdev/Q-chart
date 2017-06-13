const Hoek = require('hoek');
const server = require('./server.js');
const plugins = require('./server-plugins.js');
const routes = require('./routes/routes.js')

server.register(plugins, err => {
  Hoek.assert(!err, err);

  server.route(routes);

  server.start(err => {
    Hoek.assert(!err, err);
    console.log('Server running at: ' + server.info.uri);
  })
});