const Hapi = require('hapi');

const server = new Hapi.Server();
server.connection({
	port: process.env.PORT || 3000
});

module.exports = server;
