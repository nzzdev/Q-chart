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

const vegaConfig = require('../../vega-configs/default.json');

// todo: get this from toolRuntimeConfig
vega.formatLocale({
  "decimal": ",",
  "thousands": "'",
  "grouping": [3],
  // "currency": ["", "\u00a0CHF"]
});

vega.timeFormatLocale({
  "dateTime": "%A, der %e. %B %Y, %X",
  "date": "%d.%m.%Y",
  "time": "%H:%M:%S",
  "periods": ["AM", "PM"],
  "days": ["Sonntag", "Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"],
  "shortDays": ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
  "months": ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
  "shortMonths": ["Jan", "Feb", "Mrz", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"]
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
    const item = request.payload.item;
    const width = getExactPixelWidth(request.payload.toolRuntimeConfig);
    if (!width) {
      return Boom.badRequest('no exact pixel width given in toolRuntimeConfig.size.width');
    }

    const mappingConfig = {
      width: width
    }

    // first and foremost: cast all the floats in strings to actual floats
    item.data = getDataWithStringsCastedToFloats(item.data);

    // if we have a date series, we change the date values to date objects
    if (dateSeries.isDateSeriesData(item.data)) {
      mappingConfig.dateFormat = dateSeries.getDateFormatForData(item.data)
      item.data = dateSeries.getDataWithDateParsed(item.data);
    }

    const chartType = getChartTypeForItemAndWidth(item, width);
    
    const templateSpec = require(`../../chartTypes/${chartType}/vega-spec.json`);

    // add the config to the template vega spec to allow changes in the config through mappings
    templateSpec.config = deepmerge(vegaConfig, templateSpec.config || {});

    // add the config passed in toolRuntimeConfig
    if (request.payload.toolRuntimeConfig.hasOwnProperty('axis')) {
      templateSpec.config.axis = deepmerge(templateSpec.config.axis, request.payload.toolRuntimeConfig.axis);
    }

    // set the range configs by taking the passed ranges from toolRuntimeConfig and any possible
    // item options into account (highlighting is an example of an option changing the range)
    const categoryRange = getComputedColorRange(item, request.payload.toolRuntimeConfig);
    if (categoryRange) {
      templateSpec.config.range = {
        category: getComputedColorRange(item, request.payload.toolRuntimeConfig)
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
      // create a new view instance for a given Vega JSON spec
      var view = new vega.View(vega.parse(spec))
        .renderer('none')
        .initialize();

      // generate a static SVG image
      svg = await view.toSVG();
    } catch (err) {
      request.server.log(['error'], err);
      return err;
    }

    return {
      markup: svg
    };
  }
}
