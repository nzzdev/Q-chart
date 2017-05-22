const fs = require('fs');
const Enjoi = require('enjoi');
const Joi = require('joi');
const resourcesDir = __dirname + '/../../resources/';
const helpersDir = __dirname + '/../../helpers/';
const viewsDir = __dirname + '/../../views/';
const scriptsDir  = __dirname + '/../../scripts/';

const arrayToChartistModel = require(`${helpersDir}dataTransformer.js`).arrayToChartistModel;


// POSTed item will be validated against given schema
// hence we fetch the JSON schema...
const schemaString = JSON.parse(fs.readFileSync(resourcesDir + 'schema.json', {
  encoding: 'utf-8'
}));
// ... and let Enjoi convert it to a Joi schema for validation 
const schema = Enjoi(schemaString);

const hashMap = require(`${scriptsDir}/hashMap.json`);

// we use svelte to build tool specific markup
// first register it, second define the path of our core view template
require('svelte/ssr/register');
const staticTemplate = require(viewsDir + 'html-js.html');

module.exports = {
  method: 'POST',
  path: '/rendering-info/html-js',
  config: {
    validate: {
      options: {
        allowUnknown: true
      },
      payload: {
        // item gets validated against given schema
        item: schema,
        // one can pass further runtime configuration
        toolRuntimeConfig: Joi.object()
      }
    },
    cors: true
  },
  handler: function(request, reply) {

    const id = request.payload.toolRuntimeConfig.id || Math.floor((Math.random() * 10 ** 16));

    // prepare the data for client side rendering
    let item = request.payload.item;
    item.data = arrayToChartistModel(item.data);
    item.type = 'Line';

    const data = {
      id: `q-chart-${id}`,      
      item: request.payload.item
    };

    let systemConfigScript = `
        System.config({
          map: {
            "q-chart/chart.js": "${request.payload.toolRuntimeConfig.toolBaseUrl}/script/${hashMap['q-chart.js']}"
          }
        });
    `;

    let loaderScript = `
        System.import('q-chart/chart.js')
          .then(function(module) {
            return module.display(${JSON.stringify(request.payload.item)}, document.querySelector('#${data.id}'), ${JSON.stringify(request.payload.toolRuntimeConfig)})
          })
          .catch(function(error) {
            console.log(error)
          });
      `;

    let renderingInfo = {
      loaderConfig: {
        polyfills: ['Promise', 'Object.assign'],
        loadSystemJs: 'full'
      },
      stylesheets: [
        {
          // name of stylesheet will be used to call the correct stylesheet endpoint to load css
          // one can also specify a url instead which will result in loading css directly from that url
          name: 'default'
        }
      ],
      scripts: [
        {
          content: systemConfigScript,
          loadOnce: true
        },
        {
          content: loaderScript
        }
      ],
      // pass the data object to svelte render function to get markup
      markup: staticTemplate.render(data)
    }
    return reply(renderingInfo).type('application/json');
  }
}
