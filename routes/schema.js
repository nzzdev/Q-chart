const resourcesDir = __dirname + '/../resources/';

module.exports = {
  method: 'GET',
  path:'/schema.json',
  handler: function(request, h) {
    h.file(resourcesDir + 'schema.json');
  }
}
