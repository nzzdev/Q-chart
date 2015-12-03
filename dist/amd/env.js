define(['exports', 'module', './env.json!text'], function (exports, module, _envJsonText) {
  'use strict';

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _envJSON = _interopRequireDefault(_envJsonText);

  var env = JSON.parse(_envJSON['default']);
  module.exports = env;
});