const path = require('path');

module.exports = {
  method: 'GET',
  path: '/stylesheet/{filename}.{hash}.{extension}',
  config: {
    cors: true,
    files: {
      relativeTo: path.join(__dirname, '/../styles/')
    }
  },
  handler: function(request, reply) {
    return reply.file(`${request.params.filename}.${request.params.extension}`)
      .type('text/css')
      .header('cache-control', `max-age=${60 * 60 * 24 * 365}, immutable`); // 1 year
  }
};
