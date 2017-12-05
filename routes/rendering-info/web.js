const querystring = require('querystring');

const Joi = require('joi');
const Boom = require('boom');

const viewsDir = __dirname + '/../../views/';
const stylesDir  = __dirname + '/../../styles/';

// setup nunjucks environment
const nunjucks = require('nunjucks');
const nunjucksEnv = new nunjucks.Environment();

const styleHashMap = require(`${stylesDir}/hashMap.json`);

const getExactPixelWidth = require('../../helpers/toolRuntimeConfig.js').getExactPixelWidth;

// temp function until we have all chart types implemented with the new vega renderer
// determines if we go with the new or old renderer
function shouldUseLegacyRenderingInfo(request) {
  const item = request.payload.item;
  if (item.options.chartType === 'Line') {
    return false;
  }
  return true;
}

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
    // temp code to redirect to legacy rendering-info if item not supported by new one yet
    if (shouldUseLegacyRenderingInfo(request)) {
      try {
        const response = await request.server.inject({
          method: 'POST',
          url: `/rendering-info/html-js?${querystring.stringify(request.query)}`,
          payload: request.payload
        });
        return response.payload;
      } catch (err) {
        server.log(['error'], err);
        return Boom.internal();
      }
    }
    // end temp code

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
      // polyfill Promise
      renderingInfo.polyfills = ['Promise'];

      // return a script in rendering info
      // requesting the svg in width measured in the client
      const functionName = `loadSVG${context.id}`;
      const dataObject = `${context.id}Data`;
      renderingInfo.scripts = [
        {
          content: `
            var ${dataObject} = {
              element: document.querySelector("#${context.id}")
            };
            ${dataObject}.width = ${dataObject}.element.getBoundingClientRect().width;
            function ${functionName}() {
              fetch("${request.payload.toolRuntimeConfig.toolBaseUrl}/rendering-info/web-svg?appendItemToPayload=${request.query._id}", {
                method: 'POST',
                body: JSON.stringify({
                  toolRuntimeConfig: {
                    axis: ${JSON.stringify(request.payload.toolRuntimeConfig.axis || {})},
                    colorSchemes: ${JSON.stringify(request.payload.toolRuntimeConfig.colorSchemes || {})},
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
                var newWidth = ${dataObject}.element.getBoundingClientRect().width;
                if (newWidth !== ${dataObject}.width) {
                  ${dataObject}.width = newWidth;
                  ${functionName}();
                }
              });
            });
          `
        }
      ];
    }
    renderingInfo.stylesheets = [{
      name: styleHashMap['q-chart']
    }];
    renderingInfo.markup = nunjucksEnv.render(viewsDir + 'chart.html', context);

    return renderingInfo;
  }
}
