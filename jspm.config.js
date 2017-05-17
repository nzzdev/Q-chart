SystemJS.config({
  paths: {
    "npm:": "jspm_packages/npm/",
    "q-chart/": "chart/"
  },
  nodeConfig: {
    "paths": {
      "q-chart/": "chart/"
    }
  },
  devConfig: {
    "map": {
      "plugin-babel": "npm:systemjs-plugin-babel@0.0.21"
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
  }
});

SystemJS.config({
  packageConfigPaths: [
    "npm:@*/*.json",
    "npm:*.json"
  ],
  map: {
    "chartist": "npm:chartist@0.11.0"
  },
  packages: {}
});
