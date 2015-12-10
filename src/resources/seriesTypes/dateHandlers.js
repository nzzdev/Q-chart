import {seriesTypeConfig} from './dateConfigPerPrecision';

export var dateHandlers = {

  basedOnPrecisionAndAvailableSpace: (config, typeOptions, data, size, rect) => {
    // the ticks model
    var ticks = new Array(data.labels.length);

    config.axisX = config.axisX || {};

    // get space information for the labels
    var labels = data.labels.map((label, index) => {
      return {
        space: seriesTypeConfig[typeOptions.precision].getLabelLengthBasedOnIndex(index, data.labels.length, data, config)
      }
    });

    let xAxisWidth = rect.width - ((config.axisX.offset || 30) + 10);

    // do we have space for all the labels?
    let enoughSpace = labels.reduce((sum, label) => { return sum + label.space; }, 0) < xAxisWidth;

    // fill the ticks model
    if (enoughSpace) {
      labels.map((label, index) => ticks[index] = label);
    } else {
      labels.map((label, index) => {
        if (seriesTypeConfig[typeOptions.precision].getForceShow(index, data.labels.length, data, config, size)) {
          ticks[index] = label;
        }
      });
    }

    config.axisX.labelInterpolationFnc = (value, index) => {
      if (ticks[index]) {
        if (seriesTypeConfig.hasOwnProperty(typeOptions.precision)) {
          value = seriesTypeConfig[typeOptions.precision].formatBasedOnIndex(index, new Date(value));
        }
      } else {
        value = ' ';
      }
      return value;
    }
  },


  basedOnPrecision: (config, typeOptions, data, size, rect) => {
    if (!config.horizontalBars) {
      config.axisX.labelInterpolationFnc = (value, index) => {
        if (seriesTypeConfig.hasOwnProperty(typeOptions.precision)) {
          value = seriesTypeConfig[typeOptions.precision].formatBasedOnIndex(index, new Date(value));
        }
        return value;
      }
    } else {
      config.axisY.labelInterpolationFnc = (value, index) => {
        value = seriesTypeConfig[typeOptions.precision].format(new Date(value));
        return value;
      }
    }
  },
}
