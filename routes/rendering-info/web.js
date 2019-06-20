const querystring = require("querystring");

const Joi = require("joi");
const Boom = require("boom");

const dataHelpers = require("../../helpers/data.js");

const viewsDir = __dirname + "/../../views/";
const stylesDir = __dirname + "/../../styles/";

// setup nunjucks environment
const nunjucks = require("nunjucks");
const nunjucksEnv = new nunjucks.Environment();

const styleHashMap = require(`${stylesDir}hashMap.json`);

const getExactPixelWidth = require("../../helpers/toolRuntimeConfig.js")
  .getExactPixelWidth;
const getChartTypeForItemAndWidth = require("../../helpers/chartType.js")
  .getChartTypeForItemAndWidth;
const getDataWithStringsCastedToFloats = require("../../helpers/data.js")
  .getDataWithStringsCastedToFloats;
const legend = require("../../helpers/legend/index.js");
const colorSchemeHelpers = require("../../helpers/colorSchemes.js");

module.exports = {
  method: "POST",
  path: "/rendering-info/web",
  options: {
    validate: {
      options: {
        allowUnknown: true
      },
      payload: {
        item: Joi.object(),
        toolRuntimeConfig: Joi.object().keys({
          colorSchemes: Joi.object().keys({
            categorical_normal: Joi.array().required(),
            categorical_light: Joi.array().required()
          })
        })
      }
    }
  },
  handler: async function(request, h) {
    const item = request.payload.item;

    // we need to register the color schemes configured by toolRuntimeConfig first
    // they are used for the legend later on therefore they cannot be configured in the web-svg handler only
    colorSchemeHelpers.registerColorSchemes(
      item,
      request.payload.toolRuntimeConfig
    );

    // first and foremost: cast all the floats in strings to actual floats
    item.data = getDataWithStringsCastedToFloats(item.data);

    // check if we need to add a subtitle suffix because we will shorten the numbers for Y Axis
    const divisor = dataHelpers.getDivisor(item.data);
    if (divisor > 1) {
      if (item.subtitle && item.subtitle !== "") {
        item.subtitleSuffix = ` (in ${dataHelpers.getDivisorString(divisor)})`;
      } else {
        item.subtitleSuffix = `in ${dataHelpers.getDivisorString(divisor)}`;
      }
    }

    let legendType = "default";
    try {
      const chartType = getChartTypeForItemAndWidth(item, 300);
      const chartTypeConfig = require(`../../chartTypes/${chartType}/config.js`);
      if (chartTypeConfig.legend.type) {
        legendType = chartTypeConfig.legend.type;
      }
    } catch (e) {
      // nevermind and keep the default legendType;
    }

    const context = {
      item: item,
      displayOptions: request.payload.toolRuntimeConfig.displayOptions || {},
      legend: legend[legendType].getLegendModel(
        item,
        request.payload.toolRuntimeConfig
      ),
      id: `q_chart_${request.query._id}_${Math.floor(
        Math.random() * 100000
      )}`.replace(/-/g, "")
    };

    if (item.allowDownloadData) {
      context.linkToCSV = `${
        request.payload.toolRuntimeConfig.toolBaseUrl
      }/data?appendItemToPayload=${request.query._id}`;
    }

    const renderingInfo = {};

    // if we have the width in toolRuntimeConfig.size
    // we can send the svg right away
    const exactPixelWidth = getExactPixelWidth(
      request.payload.toolRuntimeConfig
    );
    if (typeof exactPixelWidth === "number") {
      const svgResponse = await request.server.inject({
        method: "POST",
        url: `/rendering-info/web-svg?width=${exactPixelWidth}&id=${
          context.id
        }`,
        payload: request.payload
      });
      context.svg = svgResponse.result.markup;
    } else {
      // polyfill Promise
      renderingInfo.polyfills = ["Promise"];

      // return a script in rendering info
      // requesting the svg in width measured in the client
      const functionName = `loadSVG${context.id}`;
      const dataObject = `${context.id}Data`;

      let toolRuntimeConfigForWebSVG = {};

      // we only want to send the vega spec if we need it
      // if we will render a vegaSpec, we will not apply any config
      // so no need to send it along here
      if (!item.vegaSpec) {
        toolRuntimeConfigForWebSVG = {
          axis: request.payload.toolRuntimeConfig.axis,
          text: request.payload.toolRuntimeConfig.text,
          colorSchemes: request.payload.toolRuntimeConfig.colorSchemes,
          displayOptions: request.payload.toolRuntimeConfig.displayOptions || {}
        };
        // remove the grays as they are only needed for the legend
        delete toolRuntimeConfigForWebSVG.colorSchemes.grays;
      }

      let requestMethod;
      let requestBodyString;

      const queryParams = {
        id: context.id
      };
      // if we have the current item state in DB, we do a GET request, otherwise POST with the item and toolRuntimeConfig in the payload
      if (request.payload.itemStateInDb === true) {
        requestMethod = "GET";
        queryParams.toolRuntimeConfig = JSON.stringify(
          toolRuntimeConfigForWebSVG
        );
        // add the item id to appendItemToPayload if it's state is in the db (aka not preview)
        queryParams.appendItemToPayload = request.query._id;
      } else {
        requestMethod = "POST";
        queryParams.noCache = true; // set this if we do not have item state in DB as it will probably change
        requestBodyString = JSON.stringify({
          item: request.payload.item,
          toolRuntimeConfig: toolRuntimeConfigForWebSVG
        });
      }

      renderingInfo.scripts = [
        {
          content: `
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
            var ${dataObject} = {
              element: document.querySelector("#${context.id}")
            };
            function ${functionName}() {
              fetch("${
                request.payload.toolRuntimeConfig.toolBaseUrl
              }/rendering-info/web-svg?${querystring.stringify(
            queryParams
          )}&width=" + ${dataObject}.width, {
                method: "${requestMethod}",
                ${
                  requestBodyString
                    ? "body: " + JSON.stringify(requestBodyString)
                    : ""
                }
              })
              .then(function(response) {
                return response.json();
              })
              .then(function(renderingInfo) {
                if (renderingInfo.markup) {
                  document.querySelector("#${
                    context.id
                  } .q-chart-svg-container").innerHTML = renderingInfo.markup;
                }
              });
            }
            window.q_domready.then(function() {
              ${dataObject}.width = ${dataObject}.element.getBoundingClientRect().width;
              ${functionName}();
            });
            window.addEventListener('resize', function() {
              if (requestAnimationFrame) {
                requestAnimationFrame(function() {
                  var newWidth = ${dataObject}.element.getBoundingClientRect().width;
                  if (newWidth !== ${dataObject}.width) {
                    ${dataObject}.width = newWidth;
                    ${functionName}();
                  }
                });
              }
            });
          `
        }
      ];
    }
    renderingInfo.stylesheets = [
      {
        name: styleHashMap["q-chart"]
      }
    ];
    renderingInfo.markup = nunjucksEnv.render(viewsDir + "chart.html", context);

    renderingInfo.loaderConfig = {
      polyfills: ["Promise", "fetch"]
    };

    return renderingInfo;
  }
};
