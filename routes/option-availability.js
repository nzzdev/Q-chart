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
  config: {
    validate: {
      payload: Joi.object()
    },
    cors: true
  },
  handler: function(request, reply) {
    if (request.params.optionName === 'bar') {
      return reply({
        available: isBarChart(request.payload)
      }).type('application/json');
    }

    if (request.params.optionName === 'forceBarsOnSmall') {
      return reply({
        available: isBarChart(request.payload) && !request.payload.options.barOptions.isBarChart
      }).type('application/json');
    }

    if (request.params.optionName === 'line') {
      return reply({
        available: isLineChart(request.payload)
      }).type('application/json');
    }

    if (request.params.optionName === 'dateseries') {
      let isAvailable;

      try {
        const serie = getFirstColumnSerie(request.payload.data);
        isAvailable = isDateSeries(serie);
      } catch (e) {
        isAvailable = false;
      }

      return reply({
        available: isAvailable
      }).type('application/json');
    }

    return reply(Boom.badRequest());
  }
}