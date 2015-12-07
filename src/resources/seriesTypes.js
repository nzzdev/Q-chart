export var seriesTypes = {
  'date': {
    'x': {
      modifyConfig: (config, data, size, rect) => {
        config.axisX = config.axisX || {};
        config.axisX.labelInterpolationFnc = (value, index) => {
          return value;
        }
      }
    }
  }
}
