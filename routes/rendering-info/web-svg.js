const Joi = require("@hapi/joi");
const Boom = require("@hapi/boom");
const vega = require("vega");
const deepmerge = require("deepmerge");
const { getMappedSpec } = require("../../helpers/itemVegaMapping.js");
const dataHelpers = require("../../helpers/data.js");
const { getChartTypeForItemAndWidth } = require("../../helpers/chartType.js");
const dateSeries = require("../../helpers/dateSeries.js");
const eventHelpers = require("../../helpers/events.js");
const d3config = require("../../config/d3.js");
const colorSchemeHelpers = require("../../helpers/colorSchemes.js");

const vegaConfig = require("../../config/vega-default.json");

const registerExpressionFunctions = require("../../helpers/vegaExpressionFunctions")
  .registerExpressionFunctions;

vega.timeFormatLocale(d3config.timeFormatLocale);

// thats the default and might get overwritten by a prerender function of a chart type
vega.formatLocale(d3config.formatLocale);

// borrowed from https://github.com/gka/chroma.js/blob/master/src/ops/luminance.js
function luminance_x(x) {
  x /= 255;
  return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
}

function getSpecConfig(item, baseConfig, toolRuntimeConfig) {
  // add the config to the template vega spec to allow changes in the config through mappings
  let config = deepmerge(vegaConfig, baseConfig || {});

  // add the config passed in toolRuntimeConfig
  if (toolRuntimeConfig.hasOwnProperty("axis")) {
    config.axis = deepmerge(config.axis || {}, toolRuntimeConfig.axis);
  }

  // add the config passed in toolRuntimeConfig
  if (toolRuntimeConfig.hasOwnProperty("text")) {
    config.text = deepmerge(config.text || {}, toolRuntimeConfig.text);
  }

  return config;
}

async function getSpec(id, width, chartType, item, toolRuntimeConfig) {
  const mappingData = {
    item: item,
    toolRuntimeConfig: toolRuntimeConfig,
    width: width
  };
  const chartTypeConfig = require(`../../chartTypes/${chartType}/config.js`);
  if (chartTypeConfig.data.handleDateSeries) {
    // if we have a date series, we change the date values to date objects
    // and set the detected dateFormat to the mappingData to be used within the mapping functions
    if (dateSeries.isDateSeriesData(item.data)) {
      // Convert event dates to date objects and sort them
      item.events = eventHelpers.parseEvents(item);

      mappingData.dateFormat = dateSeries.getDateFormatForData(item.data);

      // keep the original data, we need it later on to handle prognosisStart (which is an index and not a date) correctly
      mappingData.originalItemData = item.data;

      // Parse dates and add event dates
      item.data = dateSeries.getDataWithDateParsedAndSortedByDate(item.data);
      item.data = eventHelpers.extendWithEventDates(item.data, item.events);

      // handle auto interval here
      // by calculating the interval from the data and setting this to the actual data we are rendering
      if (item.options.dateSeriesOptions.interval === "auto") {
        item.options.dateSeriesOptions.interval = dateSeries.getIntervalForData(
          item.data
        );
      }
    } else {
      // Make sure that events array exists
      item.events = [];
    }
  }

  // if we do not have a dateseries, we transform all null/undefined values in the first column to empty strings to not display null in the chart
  if (!mappingData.dateFormat) {
    item.data = dataHelpers.getWithOnlyStringsInFirstColumn(item.data);
  }

  const templateSpec = require(`../../chartTypes/${chartType}/vega-spec.json`);

  templateSpec.config = getSpecConfig(
    item,
    templateSpec.config,
    mappingData.toolRuntimeConfig
  );

  // set the size to the spec
  templateSpec.width = width;

  // this will be the compiled spec from template and mapping
  let spec;
  try {
    spec = await getMappedSpec(id, chartType, templateSpec, mappingData);
  } catch (err) {
    throw new Boom.Boom(err);
  }
  return spec;
}

async function getSvg(id, request, width, item, toolRuntimeConfig = {}) {
  // first and foremost: cast all the floats in strings to actual floats
  item.data = dataHelpers.getDataWithStringsCastedToFloats(item.data);

  // first we need to know if there is a chartType and which one
  const chartType = getChartTypeForItemAndWidth(item, width);

  // apply default toolRuntimeConfig
  if (!toolRuntimeConfig.hasOwnProperty("displayOptions")) {
    toolRuntimeConfig.displayOptions = {};
  }
  if (!toolRuntimeConfig.displayOptions.hasOwnProperty("size")) {
    toolRuntimeConfig.displayOptions.size = "basic";
  }

  let spec;
  if (item.options.chartType) {
    try {
      spec = await getSpec(id, width, chartType, item, toolRuntimeConfig);
    } catch (err) {
      console.log(err);
      throw err;
    }
  } else {
    throw new Error("no spec");
  }

  let svg;

  try {
    if (process.env.DEBUG) {
      const debugHelpers = require("../../helpers/debug.js");
      const fs = require("fs");
      fs.writeFile(
        `${__dirname}/../../vega-spec-debug.json`,
        JSON.stringify(
          debugHelpers.getSpecTransformForUpstreamCompat(spec),
          null,
          2
        ),
        {},
        err => {
          if (err) {
            console.error(err);
          }
        }
      );
    }

    const dataflow = vega.parse(spec);

    try {
      const prerender = require(`../../chartTypes/${chartType}/prerender.js`);
      prerender(item, toolRuntimeConfig, spec, vega);
    } catch (err) {
      // we probably do not have prerender for this chartType
    }

    const view = new vega.View(dataflow).renderer("svg").initialize();
    view.logLevel(vega.Warn);

    svg = await view.toSVG();

    // post processing
    let postprocessings;
    try {
      postprocessings = require(`../../chartTypes/${chartType}/postprocessings.js`);
    } catch (err) {
      // we ignore errors that come from the chartType not having a postprocessing.js file
      // everything else gets rethrown
      if (err.code !== "MODULE_NOT_FOUND") {
        throw err;
      }
    }
    try {
      if (postprocessings) {
        for (let postprocessing of postprocessings) {
          svg = postprocessing.process(svg, spec, item, toolRuntimeConfig, id);
        }
      }
    } catch (err) {
      request.server.log(["error"], err);
    }
  } catch (err) {
    request.server.log(["error"], err);
    throw err;
  }

  return svg;
}

// extend Joi to support string object string coercion (see https://github.com/hapijs/joi/issues/2037 and https://github.com/hapijs/joi/blob/master/API.md#extensions)
// this is needed for toolRuntimeConfig in the query string
const Bourne = require("@hapi/bourne");
const customJoi = Joi.extend({
  type: "object",
  base: Joi.object(),
  coerce: {
    from: "string",
    method(value, helpers) {
      if (value[0] !== "{" && !/^\s*\{/.test(value)) {
        return;
      }

      try {
        return { value: Bourne.parse(value) };
      } catch (ignoreErr) {}
    }
  }
});

module.exports = {
  method: "POST",
  path: "/rendering-info/web-svg",
  options: {
    validate: {
      options: {
        allowUnknown: true
      },
      query: customJoi.object({
        width: customJoi.number().required(),
        noCache: customJoi.boolean(),
        toolRuntimeConfig: customJoi.object().optional(),
        id: customJoi.string().required()
      }),
      payload: customJoi.object({
        item: customJoi.object(),
        toolRuntimeConfig: customJoi.object()
      })
    }
  },
  handler: async function(request, h) {
    let item = request.payload.item;
    const toolRuntimeConfig =
      request.payload.toolRuntimeConfig || request.query.toolRuntimeConfig;

    // tmp: migrate the data to v2.0.0 schema.
    // this can be removed once the migration on the db is run
    const migrationResponse = await request.server.inject({
      url: "/migration",
      method: "POST",
      payload: { item: item }
    });
    if (migrationResponse.statusCode === 200) {
      item = migrationResponse.result.item;
    }

    registerExpressionFunctions(toolRuntimeConfig);

    colorSchemeHelpers.registerColorSchemes(item, toolRuntimeConfig);

    try {
      const webSvg = {
        markup: await getSvg(
          request.query.id,
          request,
          request.query.width,
          item,
          toolRuntimeConfig
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
    } catch (e) {
      throw e;
    }
  }
};
