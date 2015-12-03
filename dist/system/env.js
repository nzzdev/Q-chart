System.register(['./env.json!text'], function (_export) {
  'use strict';

  var envJSON, env;
  return {
    setters: [function (_envJsonText) {
      envJSON = _envJsonText['default'];
    }],
    execute: function () {
      env = JSON.parse(envJSON);

      _export('default', env);
    }
  };
});