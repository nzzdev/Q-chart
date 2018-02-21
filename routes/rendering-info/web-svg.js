const Joi = require("joi");
const Boom = require("boom");
const vega = require("vega");
const clone = require("clone");
const deepmerge = require("deepmerge");
const getSpecWithMappedItem = require("../../helpers/itemVegaMapping.js")
  .getSpecWithMappedItem;
const getComputedColorRange = require("../../helpers/vegaConfig.js")
  .getComputedColorRange;
const getDataWithStringsCastedToFloats = require("../../helpers/data.js")
  .getDataWithStringsCastedToFloats;
const getExactPixelWidth = require("../../helpers/toolRuntimeConfig.js")
  .getExactPixelWidth;
const getChartTypeForItemAndWidth = require("../../helpers/chartType.js")
  .getChartTypeForItemAndWidth;
const dateSeries = require("../../helpers/dateSeries.js");
const d3config = require("../../config/d3.js");

const vegaConfig = require("../../config/vega-default.json");

vega.timeFormatLocale(d3config.timeFormatLocale);

// thats the default and might get overwritten by a prerender function of a chart type
vega.formatLocale(d3config.formatLocale);

function getSpecConfig(item, baseConfig, toolRuntimeConfig) {
  // add the config to the template vega spec to allow changes in the config through mappings
  let config = deepmerge(vegaConfig, baseConfig || {});

  // add the config passed in toolRuntimeConfig
  if (toolRuntimeConfig.hasOwnProperty("axis")) {
    config.axis = deepmerge(config.axis || {}, toolRuntimeConfig.axis);
  }

  // set the range configs by taking the passed ranges from toolRuntimeConfig and any possible
  // item options into account (highlighting is an example of an option changing the range)
  const categoryRange = getComputedColorRange(item, toolRuntimeConfig);
  if (categoryRange) {
    config.range = {
      category: getComputedColorRange(item, toolRuntimeConfig)
    };
  }
  return config;
}

async function getSpec(item, width, toolRuntimeConfig) {
  // first we need to know if there is a chartType and which one
  const chartType = getChartTypeForItemAndWidth(item, width);

  const mappingConfig = {
    width: width
  };

  // if we have a date series, we change the date values to date objects
  // and set the detected dateFormat to the mappingConfig to be used within the mapping functions
  if (dateSeries.isDateSeriesData(item.data)) {
    mappingConfig.dateFormat = dateSeries.getDateFormatForData(item.data);
    item.data = dateSeries.getDataWithDateParsed(item.data);
  }

  const templateSpec = require(`../../chartTypes/${chartType}/vega-spec.json`);

  templateSpec.config = getSpecConfig(
    item,
    templateSpec.config,
    toolRuntimeConfig
  );

  // set the size to the spec
  templateSpec.width = width;

  // this will be the compiled spec from template and mapping
  let spec;
  try {
    spec = getSpecWithMappedItem(item, chartType, templateSpec, mappingConfig);
  } catch (err) {
    return Boom.notImplemented(err.message);
  }
  return spec;
}

async function getSvg(item, width, toolRuntimeConfig, request) {
  // first and foremost: cast all the floats in strings to actual floats
  item.data = getDataWithStringsCastedToFloats(item.data);

  // first we need to know if there is a chartType and which one
  const chartType = getChartTypeForItemAndWidth(item, width);

  let spec;
  if (item.vegaSpec) {
    spec = item.vegaSpec;

    // the width is given in the request
    spec.width = width;

    // set the data from the item
    // all data transforms are part of the spec
    spec.data[0].values = clone(item.data);
  } else if (item.chartType) {
    spec = await getSpec(item, width, toolRuntimeConfig);
  } else {
    throw new Error("no spec");
  }

  let svg;

  try {
    const dataflow = vega.parse(spec);

    try {
      const prerender = require(`../../chartTypes/${chartType}/prerender.js`);
      prerender(item, toolRuntimeConfig, spec, vega);
    } catch (err) {
      // we probably do not have prerender for this chartType
    }

    const view = new vega.View(dataflow).renderer("none").initialize();
    svg = await view.toSVG();

    // post processing
    try {
      const postprocessing = require(`../../chartTypes/${chartType}/postprocessing.js`);
      svg = postprocessing.process(svg, item, toolRuntimeConfig);
    } catch (err) {
      // we probably do not have postprocessing for this chartType
    }
  } catch (err) {
    request.server.log(["error"], err);
    return err;
  }

  return svg;
}

module.exports = {
  method: "POST",
  path: "/rendering-info/web-svg",
  options: {
    validate: {
      options: {
        allowUnknown: true
      },
      query: {
        width: Joi.number().required(),
        noCache: Joi.boolean(),
        toolRuntimeConfig: Joi.object().optional()
      },
      payload: {
        item: Joi.object().required(),
        toolRuntimeConfig: Joi.object().optional()
      }
    }
  },
  handler: async function(request, h) {
    const item = request.payload.item;
    const toolRuntimeConfig =
      request.payload.toolRuntimeConfig || request.query.toolRuntimeConfig;
    const webSvg = {
      markup: await getSvg(
        item,
        request.query.width,
        toolRuntimeConfig,
        request
      )
    };

    const response = h.response(webSvg);
    if (!request.query.noCache) {
      response.header(
        "cache-control",
        "public, max-age=60, s-maxage=60, stale-while-revalidate=86400, stale-if-error=86400"
      );
    }
    return response;
  }
};
