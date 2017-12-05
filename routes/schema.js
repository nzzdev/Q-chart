const resourcesDir = __dirname + '/../resources/';

module.exports = {
  method: 'GET',
  path:'/schema.json',
  handler: function(request, h) {
    return h.file(resourcesDir + 'schema.json');
  }
}
