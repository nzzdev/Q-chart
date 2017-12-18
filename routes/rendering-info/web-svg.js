const Joi = require('joi');
const Boom = require('boom');
const vega = require('vega');
const clone = require('clone');
const deepmerge = require('deepmerge');
const getSpecWithMappedItem = require('../../helpers/itemVegaMapping.js').getSpecWithMappedItem;
const getComputedColorRange = require('../../helpers/vegaConfig.js').getComputedColorRange;
const getDataWithStringsCastedToFloats = require('../../helpers/data.js').getDataWithStringsCastedToFloats;
const getExactPixelWidth = require('../../helpers/toolRuntimeConfig.js').getExactPixelWidth;
const getChartTypeForItemAndWidth = require('../../helpers/chartType.js').getChartTypeForItemAndWidth;
const dateSeries = require('../../helpers/dateSeries.js');
const d3config = require('../../config/d3.js');

const vegaConfig = require('../../config/vega-default.json');

// todo: get this from toolRuntimeConfig
vega.formatLocale(d3config.formatLocale);

vega.timeFormatLocale(d3config.timeFormatLocale);

async function getSvg(item, width, toolRuntimeConfig, request) {
  const mappingConfig = {
    width: width
  }

  // first and foremost: cast all the floats in strings to actual floats
  item.data = getDataWithStringsCastedToFloats(item.data);

  // if we have a date series, we change the date values to date objects
  // and set the detected dateFormat to the mappingConfig to be used within the mapping functions
  if (dateSeries.isDateSeriesData(item.data)) {
    mappingConfig.dateFormat = dateSeries.getDateFormatForData(item.data)
    item.data = dateSeries.getDataWithDateParsed(item.data);
  }

  const chartType = getChartTypeForItemAndWidth(item, width);
  
  const templateSpec = require(`../../chartTypes/${chartType}/vega-spec.json`);

  // add the config to the template vega spec to allow changes in the config through mappings
  templateSpec.config = deepmerge(vegaConfig, templateSpec.config || {});

  // add the config passed in toolRuntimeConfig
  if (toolRuntimeConfig.hasOwnProperty('axis')) {
    templateSpec.config.axis = deepmerge(templateSpec.config.axis, toolRuntimeConfig.axis);
  }

  // set the range configs by taking the passed ranges from toolRuntimeConfig and any possible
  // item options into account (highlighting is an example of an option changing the range)
  const categoryRange = getComputedColorRange(item, toolRuntimeConfig);
  if (categoryRange) {
    templateSpec.config.range = {
      category: getComputedColorRange(item, toolRuntimeConfig)
    }
  }

  let spec;
  try {
    spec = getSpecWithMappedItem(item, chartType, templateSpec, mappingConfig);
  } catch (err) {
    return Boom.notImplemented(err.message);
  }

  // set the size to the spec
  spec.width = width;

  let svg;

  try {
    const dataflow = vega.parse(spec);
    const view = new vega.View(dataflow)
      .renderer('none')
      .initialize();

    svg = await view.toSVG();
  } catch (err) {
    request.server.log(['error'], err);
    return err;
  }

  return svg;
}

module.exports = {
  method: 'POST',
  path: '/rendering-info/web-svg',
  options: {
    validate: {
      options: {
        allowUnknown: true
      },
      query: {
        width: Joi.number().required(),
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
    const toolRuntimeConfig = request.payload.toolRuntimeConfig || request.query.toolRuntimeConfig;
    return {
      markup: await getSvg(item, request.query.width, toolRuntimeConfig, request)
    }
  }
};

