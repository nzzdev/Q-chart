SystemJS.config({
  paths: {
    "npm:": "jspm_packages/npm/"
  },
  browserConfig: {
    "baseURL": "/",
    "paths": {
      "q-chart/": "src/"
    }
  },
  nodeConfig: {
    "paths": {
      "q-chart/": "chart/"
    }
  },
  transpiler: "plugin-babel",
  packages: {
    "q-chart": {
      "main": "q-chart.js",
      "meta": {
        "*.js": {
          "loader": "plugin-babel"
        }
      }
    }
  },
  map: {
    "plugin-babel": "npm:systemjs-plugin-babel@0.0.21"
  }
});

SystemJS.config({
  packageConfigPaths: [
    "npm:@*/*.json",
    "npm:*.json"
  ],
  map: {
    "chartist": "npm:chartist@0.11.0",
    "systemjs-plugin-babel": "npm:systemjs-plugin-babel@0.0.21"
  },
  packages: {}
});
