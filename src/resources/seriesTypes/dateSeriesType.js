import {seriesTypeConfig} from './dateConfigPerLabelInterval';
import {isThereEnoughSpace} from './helpers';

// filters the labels and only shows the ones at the given interval in typeOptions
function getLabelsToDisplay(typeOptions, data) {
  let labelsToDisplay = [];
  let lastLabel;
  data.labels.map((label, index) => {
    let formattedLabel = label;
    if (seriesTypeConfig[typeOptions.labelInterval] && seriesTypeConfig[typeOptions.labelInterval].format) {
      formattedLabel = seriesTypeConfig[typeOptions.labelInterval].format(index, data.labels.length, new Date(label.toString()), true);
    }
    if (formattedLabel !== lastLabel) {
      lastLabel = formattedLabel;
      labelsToDisplay[index] = label;
    }
  })
  return labelsToDisplay;
}

function isLastVisibleLabel(labelsToDisplay, labelIndex) {
  return (labelsToDisplay.length - 1 === labelIndex);
}

export function setLabelsBasedOnIntervalAndAvailableSpace(config, typeOptions, data, size, rect, fontstyle) {
  let labelsToDisplay = getLabelsToDisplay(typeOptions, data);

  config.axisX = config.axisX || {};

  if (isThereEnoughSpace(labelsToDisplay, rect, config, fontstyle)) {
    data.labels.map((label, index) => {
      if (labelsToDisplay[index]) {
        data.labels[index] = seriesTypeConfig[typeOptions.labelInterval].format(index, isLastVisibleLabel(labelsToDisplay, index), new Date(label.toString()));
      } else {
        data.labels[index] = ''; // do not show a gridline
      }
    });
  } else {
    data.labels.map((label, index) => {
      if (labelsToDisplay[index]) {
        if (seriesTypeConfig[typeOptions.labelInterval]
            && seriesTypeConfig[typeOptions.labelInterval].getForceShow
            && seriesTypeConfig[typeOptions.labelInterval].getForceShow(index, isLastVisibleLabel(labelsToDisplay, index), data, config, size)) {
          data.labels[index] = seriesTypeConfig[typeOptions.labelInterval].format(index, isLastVisibleLabel(labelsToDisplay, index), new Date(label.toString()));
        } else {
          data.labels[index] = ' '; // return false/empty string to make chartist not render a gridline here.
        }
      } else {
        data.labels[index] = ''; // do not show a gridline
      }
    });
  }
}

export function setLabelsBasedOnInterval(config, typeOptions, data, size, rect) {
  let labelsToDisplay = getLabelsToDisplay(typeOptions, data);

  data.labels.map((label, index) => {
    data.labels[index] = seriesTypeConfig[typeOptions.labelInterval].format(index, isLastVisibleLabel(labelsToDisplay, index), new Date(label.toString()), true);
  });
}
