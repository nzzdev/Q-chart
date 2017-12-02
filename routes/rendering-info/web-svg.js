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

const vegaConfig = require('../../vega-configs/default.json');

// todo: get this from toolRuntimeConfig
vega.formatLocale({
  "decimal": ",",
  "thousands": "'",
  "grouping": [3],
  // "currency": ["", "\u00a0CHF"]
});

module.exports = {
  method: 'POST',
  path: '/rendering-info/web-svg',
  options: {
    validate: {
      payload: {
        item: Joi.object(),
        toolRuntimeConfig: Joi.object()
      }
    }
  },
  handler: async function(request, h) {
    const width = getExactPixelWidth(request.payload.toolRuntimeConfig);
    if (!width) {
      return Boom.badRequest('no exact pixel width given in toolRuntimeConfig.size.width');
    }

    // first and foremost: cast all the floats in strings to actual floats
    request.payload.item.data = getDataWithStringsCastedToFloats(request.payload.item.data);

    const chartType = getChartTypeForItemAndWidth(request.payload.item, width);
    
    const templateSpec = require(`../../chartTypes/${chartType}/vega-spec.json`);

    // add the config to the template vega spec to allow changes in the config through mappings
    templateSpec.config = deepmerge(vegaConfig, templateSpec.config || {});

    // set the range configs by taking the passed ranges from toolRuntimeConfig and any possible
    // item options into account (highlighting is an example of an option changing the range)
    const categoryRange = getComputedColorRange(request.payload.item, request.payload.toolRuntimeConfig);
    if (categoryRange) {
      templateSpec.config.range = {
        category: getComputedColorRange(request.payload.item, request.payload.toolRuntimeConfig)
      }
    }

    let spec;
    try {
      spec = getSpecWithMappedItem(request.payload.item, chartType, templateSpec, {
        width: width
      });
    } catch (err) {
      return Boom.notImplemented(err.message);
    }

    // set the size to the spec
    spec.width = width;

    let svg;

    try {
      // create a new view instance for a given Vega JSON spec
      var view = new vega.View(vega.parse(spec))
        .renderer('none')
        .initialize();

      // generate a static SVG image
      svg = await view.toSVG();
    } catch (err) {
      console.log(err);
      return err;
    }

    return {
      markup: svg
    };
  }
}
