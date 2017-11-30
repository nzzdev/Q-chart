const Hapi = require('hapi');

const server = Hapi.server({
  port: process.env.PORT || 3000,
  routes: {
    cors: true
  }
});

const routes = require('./routes/routes.js');

async function init() {
  server.route(routes);
  
  await server.start();
  console.log('server running ', server.info.uri)
}

init();
