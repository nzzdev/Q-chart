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
      id: 'q_chart_' + request.query._id + '_' + Math.floor(Math.random() * 100000)
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
      const functionName = `loadSVG${context.id}`;
      const dataObject = `${context.id}Data`;
      renderingInfo.scripts = [
        {
          content: `
            var ${dataObject} = {
              width: document.getElementById("${context.id}").getBoundingClientRect().width
            };
            function ${functionName}() {
              fetch("${request.payload.toolRuntimeConfig.toolBaseUrl}/rendering-info/web-svg?appendItemToPayload=${request.query._id}", {
                method: 'POST',
                body: JSON.stringify({
                  toolRuntimeConfig: {
                    axis: ${JSON.stringify(request.payload.toolRuntimeConfig.axis || {})},
                    size: {
                      width: [
                        {
                          value: ${dataObject}.width,
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
            }
            ${functionName}();
            window.addEventListener('resize', () => {
              requestAnimationFrame(() => {
                var newWidth = document.getElementById("${context.id}").getBoundingClientRect().width;
                if (newWidth !== ${dataObject}.width) {
                  ${dataObject}.width = newWidth;
                  ${functionName}();
                }
              });
            });
          `
        }
      ]
    }

    renderingInfo.markup = nunjucksEnv.render(viewsDir + 'chart.html', context);

    return renderingInfo;
  }
}
