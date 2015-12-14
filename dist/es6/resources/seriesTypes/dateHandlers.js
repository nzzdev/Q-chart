import {seriesTypeConfig} from './dateConfigPerPrecision';

export var dateHandlers = {

  modifyDataBasedOnPrecisionAndAvailableSpace: (config, typeOptions, data, size, rect) => {
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
      data.labels.map((label, index) => {
        ticks[index] = label;
        data.labels[index] = seriesTypeConfig[typeOptions.precision].formatBasedOnIndex(index, data.labels.length, new Date(label.toString()));
      });
    } else {
      data.labels.map((label, index) => {
        if (seriesTypeConfig[typeOptions.precision].getForceShow(index, data.labels.length, data, config, size)) {
          ticks[index] = label;
          data.labels[index] = seriesTypeConfig[typeOptions.precision].formatBasedOnIndex(index, data.labels.length, new Date(label.toString()));
        } else {
          data.labels[index] = ' '; // return false/empty string to make chartist not render a gridline here.
        }
      });
    }
  },

  modifyDataBasedOnPrecision: (config, typeOptions, data, size, rect) => {
    if (!config.horizontalBars) {
      for (let i = 0; i < data.labels.length; i++) {
        data.labels[i] = seriesTypeConfig[typeOptions.precision].formatBasedOnIndex(i, data.labels.length, new Date(data.labels[i].toString()));
      }
    } else {
      for (let i = 0; i < data.labels.length; i++) {
        data.labels[i] = seriesTypeConfig[typeOptions.precision].format(new Date(data.labels[i].toString()));
      }
    }
  },
}
