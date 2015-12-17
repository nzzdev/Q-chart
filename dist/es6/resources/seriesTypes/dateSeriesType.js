import {seriesTypeConfig} from './dateConfigPerLabelInterval';

// filters the labels and only shows the ones at the given interval in typeOptions
function getLabelsToDisplay(typeOptions, data) {
  let labelsToDisplay = [];
  let lastLabel;
  data.labels.map((label, index) => {
    let formattedLabel = seriesTypeConfig[typeOptions.labelInterval].format(index, data.labels.length, new Date(label.toString()), true);
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

export function setLabelsBasedOnIntervalAndAvailableSpace(config, typeOptions, data, size, rect) {
  let labelsToDisplay = getLabelsToDisplay(typeOptions, data);

  config.axisX = config.axisX || {};

  // get space information for the labels
  var labels = data.labels.map((label, index) => {
    let space;
    if (labelsToDisplay[index]) {
      space = seriesTypeConfig[typeOptions.labelInterval].getLabelLength(index, isLastVisibleLabel(labelsToDisplay, index), data, config);
    } else {
      space = 0;
    }
    return {
      space: space
    }
  });

  let xAxisWidth = rect.width - ((config.axisX.offset || 30) + 10);

  // do we have space for all the labels?
  let enoughSpace = labels.reduce((sum, label) => { return sum + label.space; }, 0) < xAxisWidth;

  if (enoughSpace) {
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
        if (seriesTypeConfig[typeOptions.labelInterval].getForceShow(index, isLastVisibleLabel(labelsToDisplay, index), data, config, size)) {
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
