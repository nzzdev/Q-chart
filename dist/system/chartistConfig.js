System.register([], function (_export) {
  "use strict";

  var bar, line;
  return {
    setters: [],
    execute: function () {
      bar = {
        fullWidth: true,
        chartPadding: {
          right: 40
        }
      };

      _export("bar", bar);

      line = {
        fullWidth: true,
        chartPadding: {
          right: 40
        }
      };

      _export("line", line);
    }
  };
});