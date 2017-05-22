const Boom = require('boom');
const Joi = require('joi');

function getHighlightEnum(item) {
  if (item.data.length < 1) {
    return [null];
  }
  // constructs an array like [null,0,1,2,3,...] with as many indexes as there are data columns
  return [null].concat([...item.data[0].slice(1).keys()]);
}

function getHighlightEnumTitles(item) {
  if (item.data.length < 1) {
    return ['keine'];
  }
  return ['keine'].concat(item.data[0].slice(1));
} 

module.exports = {
  method: 'POST',
  path:'/dynamic-enum/{optionName}',
  config: {
    validate: {
      payload: Joi.object()
    },
    cors: true
  },
  handler: function(request, reply) {
    if (request.params.optionName === 'highlightDataSeries') {
      return reply({
        enum: getHighlightEnum(request.payload),
        enum_titles: getHighlightEnumTitles(request.payload)
      }).type('application/json');
    }

    return reply(Boom.badRequest());
  }
}