const Boom = require('boom');
const Joi = require('joi');
const getFirstColumnSerie = require('../helpers/dateSeries.js').getFirstColumnSerie;

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

function getPrognosisStartEnum(item) {
  try {
    // constructs an array like [null,0,1,2,3,...] with the indexes from the first data column
    return [null].concat([...getFirstColumnSerie(item.data).keys()]);
  } catch (e) {
    return [null]
  }
}
function getPrognosisStartEnumTitles(item) {
  try {
    return ['keine'].concat(getFirstColumnSerie(item.data));
  } catch (e) {
    return ['keine']
  }
}

module.exports = {
  method: 'POST',
  path:'/dynamic-enum/{optionName}',
  options: {
    validate: {
      payload: Joi.object()
    },
    cors: true
  },
  handler: function(request, h) {
    if (request.params.optionName === 'highlightDataSeries') {
      return {
        enum: getHighlightEnum(request.payload),
        enum_titles: getHighlightEnumTitles(request.payload)
      };
    }

    if (request.params.optionName === 'prognosisStart') {
      return {
        enum: getPrognosisStartEnum(request.payload),
        enum_titles: getPrognosisStartEnumTitles(request.payload)
      };
    }

    return Boom.badRequest();
  }
}
