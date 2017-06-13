const fs = require('fs');
const sass = require('node-sass');
const Boom = require('boom');
const path = require('path');
const autoprefixer = require('autoprefixer');
const postcss = require('postcss');
const autoprefixerPlugin = autoprefixer({
  browsers: ['ie > 9', 'last 3 versions']
});

const stylesDir = __dirname + '/../styles/'

module.exports = {
  method: 'GET',
  path: '/stylesheet/{name*}',
  handler: function(request, reply) {
    const filePath = stylesDir + `${request.params.name}.scss`;
    fs.exists(filePath, (exists) => {
      if (!exists) {
        return reply(Boom.notFound())
      }
      sass.render(
        {
          file: filePath,
          includePaths: ['jspm_packages/github/', 'jspm_packages/npm/'],
          outputStyle: 'compressed'
        }, 
        (err, result) => {
          if (err) {
            reply(Boom.badImplementation(err));
          } else {
            postcss([ autoprefixerPlugin ]).process(result.css)
              .then(result => {
                if (result.warnings().length > 0) {
                  return reply(result).type('text/css');
                }
                return reply(result.css).type('text/css');
              });
          }
        }
      )
    });
  }
}
