System.register(['./dateConfigPerLabelInterval'], function (_export) {
  'use strict';

  var seriesTypeConfig;

  _export('setLabelsBasedOnIntervalAndAvailableSpace', setLabelsBasedOnIntervalAndAvailableSpace);

  _export('setLabelsBasedOnInterval', setLabelsBasedOnInterval);

  function getLabelsToDisplay(typeOptions, data) {
    var labelsToDisplay = [];
    var lastLabel = undefined;
    data.labels.map(function (label, index) {
      var formattedLabel = seriesTypeConfig[typeOptions.labelInterval].format(index, data.labels.length, new Date(label.toString()), true);
      if (formattedLabel !== lastLabel) {
        lastLabel = formattedLabel;
        labelsToDisplay[index] = label;
      }
    });
    return labelsToDisplay;
  }

  function isLastVisibleLabel(labelsToDisplay, labelIndex) {
    return labelsToDisplay.length - 1 === labelIndex;
  }

  function setLabelsBasedOnIntervalAndAvailableSpace(config, typeOptions, data, size, rect) {
    var labelsToDisplay = getLabelsToDisplay(typeOptions, data);

    config.axisX = config.axisX || {};

    var labels = data.labels.map(function (label, index) {
      var space = undefined;
      if (labelsToDisplay[index]) {
        space = seriesTypeConfig[typeOptions.labelInterval].getLabelLength(index, isLastVisibleLabel(labelsToDisplay, index), data, config);
      } else {
        space = 0;
      }
      return {
        space: space
      };
    });

    var xAxisWidth = rect.width - ((config.axisX.offset || 30) + 10);

    var enoughSpace = labels.reduce(function (sum, label) {
      return sum + label.space;
    }, 0) < xAxisWidth;

    if (enoughSpace) {
      data.labels.map(function (label, index) {
        if (labelsToDisplay[index]) {
          data.labels[index] = seriesTypeConfig[typeOptions.labelInterval].format(index, isLastVisibleLabel(labelsToDisplay, index), new Date(label.toString()));
        } else {
          data.labels[index] = '';
        }
      });
    } else {
        data.labels.map(function (label, index) {
          if (labelsToDisplay[index]) {
            if (seriesTypeConfig[typeOptions.labelInterval].getForceShow(index, isLastVisibleLabel(labelsToDisplay, index), data, config, size)) {
              data.labels[index] = seriesTypeConfig[typeOptions.labelInterval].format(index, isLastVisibleLabel(labelsToDisplay, index), new Date(label.toString()));
            } else {
              data.labels[index] = ' ';
            }
          } else {
              data.labels[index] = '';
            }
        });
      }
  }

  function setLabelsBasedOnInterval(config, typeOptions, data, size, rect) {
    var labelsToDisplay = getLabelsToDisplay(typeOptions, data);

    data.labels.map(function (label, index) {
      data.labels[index] = seriesTypeConfig[typeOptions.labelInterval].format(index, isLastVisibleLabel(labelsToDisplay, index), new Date(label.toString()), true);
    });
  }

  return {
    setters: [function (_dateConfigPerLabelInterval) {
      seriesTypeConfig = _dateConfigPerLabelInterval.seriesTypeConfig;
    }],
    execute: function () {}
  };
});