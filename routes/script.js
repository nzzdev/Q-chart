const path = require('path');

module.exports = {
  method: 'GET',
  path: '/script/{filename}.{hash}.{extension}',
  config: {
    cors: true,
    cache: {
      expiresIn: 1000 * 60 * 60 * 24 * 365 // 1 year
    },
    files: {
      relativeTo: path.join(__dirname, '/../scripts/')
    }
  },
  handler: function(request, reply) {
    return reply.file(`${request.params.filename}.${request.params.extension}`).type('text/javascript');
  }
}

