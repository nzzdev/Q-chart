const Joi = require('joi');
const Boom = require('boom');

const viewsDir = __dirname + '/../../views/';

// setup nunjucks environment
const nunjucks = require('nunjucks');
const nunjucksEnv = new nunjucks.Environment();

const getExactPixelWidth = require('../../helpers/toolRuntimeConfig.js').getExactPixelWidth;

module.exports = {
  method: 'POST',
  path: '/rendering-info/web',
  options: {
    validate: {
      payload: {
        item: Joi.object(),
        toolRuntimeConfig: Joi.object()
      }
    }
  },
  handler: async function(request, h) {
    const context = {
      item: request.payload.item,
      id: 'q-chart-' + request.query._id + '-' + Math.floor(Math.random() * 100000)
    };

    const renderingInfo = {};

    // if we have the width in toolRuntimeConfig.size
    // we can send the svg right away
    const exactPixelWidth = getExactPixelWidth(request.payload.toolRuntimeConfig);
    if (Number.isInteger(exactPixelWidth)) {
      const svgResponse = await request.server.inject({
        method: 'POST',
        url: '/rendering-info/web-svg',
        payload: request.payload
      });
      context.svg = svgResponse.result.markup;
    } else {
      // return a script in rendering info
      // requesting the svg in width measured in the client
      renderingInfo.scripts = [
        {
          content: `
            var svgString = fetch("${request.payload.toolRuntimeConfig.toolBaseUrl}/rendering-info/web-svg?appendItemToPayload=${request.query._id}", {
              method: 'POST',
              body: JSON.stringify({
                toolRuntimeConfig: {
                  size: {
                    width: [
                      {
                        value: document.getElementById("${context.id}").getBoundingClientRect().width,
                        comparison: '='
                      }
                    ]
                  }
                }
              })
            })
            .then(response => {
              return response.json();
            })
            .then(renderingInfo => {
              document.querySelector("#${context.id} .q-chart-svg-container").innerHTML = renderingInfo.markup;
            });
          `
        }
      ]
    }

    renderingInfo.markup = nunjucksEnv.render(viewsDir + 'chart.html', context);

    return renderingInfo;
  }
}
