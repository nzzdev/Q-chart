const Boom = require('boom');
const Joi = require('joi');
const isDateSeries = require('../helpers/dateSeries.js').isDateSeries;
const getFirstColumnSerie = require('../helpers/dateSeries.js').getFirstColumnSerie;

function isBarChart(item) {
  return (item.options.chartType === 'Bar' || item.options.chartType === 'StackedBar');
}

function isLineChart(item) {
  return (item.options.chartType === 'Line');
}

module.exports = {
  method: 'POST',
  path:'/option-availability/{optionName}',
  options: {
    validate: {
      payload: Joi.object()
    },
    cors: true
  },
  handler: function(request, h) {
    if (request.params.optionName === 'bar') {
      return {
        available: isBarChart(request.payload)
      };
    }

    if (request.params.optionName === 'forceBarsOnSmall') {
      return {
        available: isBarChart(request.payload) && !request.payload.options.barOptions.isBarChart
      };
    }

    if (request.params.optionName === 'line') {
      return {
        available: isLineChart(request.payload)
      };
    }

    if (request.params.optionName === 'dateseries') {
      let isAvailable;

      try {
        const serie = getFirstColumnSerie(request.payload.data);
        isAvailable = isDateSeries(serie);
      } catch (e) {
        isAvailable = false;
      }

      return {
        available: isAvailable
      };
    }

    return reply(Boom.badRequest());
  }
}
