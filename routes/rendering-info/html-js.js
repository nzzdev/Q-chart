const fs = require("fs");
const Boom = require("boom");

const resourcesDir = __dirname + "/../../resources/";
const helpersDir = __dirname + "/../../helpers/";
const viewsDir = __dirname + "/../../views/";
const scriptsDir = __dirname + "/../../scripts/";
const stylesDir = __dirname + "/../../styles/";

const dataToChartistModel = require(`${helpersDir}itemTransformer.js`)
  .dataToChartistModel;
const optionsToLegacyModel = require(`${helpersDir}itemTransformer.js`)
  .optionsToLegacyModel;
const isDateSeries = require(`${helpersDir}dateSeries.js`).isDateSeries;
const getFirstColumnSerie = require(`${helpersDir}dateSeries.js`)
  .getFirstColumnSerie;

const scriptHashMap = require(`${scriptsDir}/hashMap.json`);
const styleHashMap = require(`${stylesDir}/hashMap.json`);

// we use svelte to build tool specific markup
// first register it, second define the path of our core view template
require("svelte/ssr/register");
const staticTemplate = require(viewsDir + "HtmlJs.html");

// POSTed item will be validated against given schema
// hence we fetch the JSON schema...
const schemaString = JSON.parse(
  fs.readFileSync(resourcesDir + "schema.json", {
    encoding: "utf-8"
  })
);
const Ajv = require("ajv");
const ajv = new Ajv();

// add draft-04 support explicit
ajv.addMetaSchema(require("ajv/lib/refs/json-schema-draft-04.json"));

const validate = ajv.compile(schemaString);
function validateAgainstSchema(item, options) {
  if (validate(item)) {
    return item;
  } else {
    throw Boom.badRequest(JSON.stringify(validate.errors));
  }
}

async function validatePayload(payload, options, next) {
  if (typeof payload !== "object") {
    return next(Boom.badRequest(), payload);
  }
  if (typeof payload.item !== "object") {
    return next(Boom.badRequest(), payload);
  }
  if (typeof payload.toolRuntimeConfig !== "object") {
    return next(Boom.badRequest(), payload);
  }
  await validateAgainstSchema(payload.item, options);
}

module.exports = {
  method: "POST",
  path: "/rendering-info/html-js",
  config: {
    validate: {
      options: {
        allowUnknown: true
      },
      payload: validatePayload
    },
    cors: true,
    cache: false // do not send cache control header to let it be added by Q Server
  },
  handler: function(request, h) {
    const id =
      request.payload.toolRuntimeConfig.id ||
      Math.floor(Math.random() * 10 ** 16);

    // prepare the data for client side rendering
    let item = request.payload.item;
    item.isDateSeries = isDateSeries(getFirstColumnSerie(item.data));

    item = optionsToLegacyModel(item);

    item.xAxisLabel = item.data[0][0];
    item.seriesLabels = item.data[0].slice(1);

    // finally transform the data to the model that chartist needs
    try {
      item.data = dataToChartistModel(item.data);
    } catch (e) {
      return Boom.badRequest();
    }

    const data = {
      id: `q-chart-${id}`,
      item: request.payload.item,
      displayOptions: request.payload.toolRuntimeConfig.displayOptions || {}
    };

    let domReadyScript = `
      if (!window.q_domready) {
        window.q_domready = new Promise(function(resolve) {
          if (document.readyState && (document.readyState === 'interactive' || document.readyState === 'complete')) {
            resolve();
          } else {
            function onReady() {
              resolve();
              document.removeEventListener('DOMContentLoaded', onReady, true);
            }
            document.addEventListener('DOMContentLoaded', onReady, true);
            document.onreadystatechange = function() {
              if (document.readyState === "interactive") {
                resolve();
              }
            }
          }
        });
      }
    `;

    let systemConfigScript = `
        System.config({
          map: {
            "q-chart/chart.js": "${
              request.payload.toolRuntimeConfig.toolBaseUrl
            }/script/${scriptHashMap["q-chart"]}"
          }
        });
    `;

    let loaderScript = `
        System.import('q-chart/chart.js')
          .then(function(module) {
            window.q_domready
              .then(function() {
                return module.display(${JSON.stringify(
                  item
                )}, document.querySelector('#${data.id}'), ${JSON.stringify(
      request.payload.toolRuntimeConfig
    )});
              })
          })
          .catch(function(error) {
            console.log(error)
          });
      `;

    let renderingInfo = {
      loaderConfig: {
        polyfills: ["Promise", "Object.assign"],
        loadSystemJs: "full"
      },
      stylesheets: [
        {
          // name of stylesheet will be used to call the correct stylesheet endpoint to load css
          // one can also specify a url instead which will result in loading css directly from that url
          name: styleHashMap.default
        }
      ],
      scripts: [
        {
          content: domReadyScript,
          loadOnce: true
        },
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
    };
    return renderingInfo;
  }
};
