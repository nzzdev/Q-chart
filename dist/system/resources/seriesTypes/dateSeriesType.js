System.register(['./dateConfigPerLabelInterval', './helpers'], function (_export) {
  'use strict';

  var seriesTypeConfig, isThereEnoughSpace;

  _export('setLabelsBasedOnIntervalAndAvailableSpace', setLabelsBasedOnIntervalAndAvailableSpace);

  _export('setLabelsBasedOnInterval', setLabelsBasedOnInterval);

  function getLabelsToDisplay(typeOptions, data) {
    var labelsToDisplay = [];
    var lastLabel = undefined;
    data.labels.map(function (label, index) {
      var formattedLabel = label;
      if (seriesTypeConfig[typeOptions.labelInterval] && seriesTypeConfig[typeOptions.labelInterval].format) {
        formattedLabel = seriesTypeConfig[typeOptions.labelInterval].format(index, data.labels.length, new Date(label.toString()), true);
      }
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

  function setLabelsBasedOnIntervalAndAvailableSpace(config, typeOptions, data, size, rect, fontstyle) {
    var labelsToDisplay = getLabelsToDisplay(typeOptions, data);

    config.axisX = config.axisX || {};

    if (isThereEnoughSpace(labelsToDisplay, rect, config, fontstyle)) {
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
            if (seriesTypeConfig[typeOptions.labelInterval] && seriesTypeConfig[typeOptions.labelInterval].getForceShow && seriesTypeConfig[typeOptions.labelInterval].getForceShow(index, isLastVisibleLabel(labelsToDisplay, index), data, config, size)) {
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
    }, function (_helpers) {
      isThereEnoughSpace = _helpers.isThereEnoughSpace;
    }],
    execute: function () {}
  };
});