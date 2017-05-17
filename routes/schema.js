const resourcesDir = __dirname + '/../resources/';

module.exports = {
  method: 'GET',
  path:'/schema.json',
  handler: function(request, reply) {
    reply.file(resourcesDir + 'schema.json');
  }
}