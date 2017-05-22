const Boom = require('boom');
const Joi = require('joi');

function hasIsColumnChart(item) {
  return (item.options.chartType === 'Bar' || item.options.chartType === 'StackedBar');
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
    if (request.params.optionName === 'isColumnChart') {
      return reply({
        available: hasIsColumnChart(request.payload)
      }).type('application/json');
    }

    return reply(Boom.badRequest());
  }
}