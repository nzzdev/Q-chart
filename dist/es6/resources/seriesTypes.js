function pad(value, toLength) {
  value = value.toString();
  while(toLength - value.toString().length > 0) {
    value = `0${value}`;
  }
  return value;
}

var dateSettingsForPrecisions = {
  year: {
    format: (index, date) => {
      if (index === 0) {
        return date.getFullYear();
      } else {
        return date.getFullYear().toString().slice(2);
      }
    },
    getLabelLength: (index) => {
      return index === 0 ? 100 : 20;
    }
  },
  month: {
    format: (index, date) => {
      if (index === 0) {
        return `${pad(date.getMonth()+1,2)}.${date.getFullYear()}`;
      } else {
        return `${pad(date.getMonth()+1,2)}`;
      }
    },
    getLabelLength: (index) => {
      return index === 0 ? 100 : 20;
    }
  },
  day: {
    format: (index, date) => {
      if (index === 0) {
        return `${pad(date.getDate(),2)}.${pad(date.getMonth()+1,2)}.${date.getFullYear()}`;
      } else {
        return `${pad(date.getDate(),2)}`;
      }
    },
    getLabelLength: (index) => {
      return index === 0 ? 100 : 20;
    }
  },
  hour: {
    format: (index, date) => {
      return `${pad(date.getHours()+1,2)}:${pad(date.getMinutes(),2)}`;
    },
    getLabelLength: (index) => {
      return 40;
    }
  }
}

function modifyConfigDateX(config, typeOptions, data, size, rect) {
  config.axisX = config.axisX || {};

  var labels = data.labels.map((label, index) => {
    return {
      space: dateSettingsForPrecisions[typeOptions.precision].getLabelLength(index)
    }
  });

  let xAxisWidth = rect.width - ((config.axisY.offset || 0) + 10);

  // do we have space for all the labels?
  let enoughSpace = labels.reduce((sum, label) => { return sum + label.space; }, 0) < xAxisWidth;

  if (enoughSpace) {

    labels.map(label => label.show = true);

  } else {

    let numberOfLabels = data.labels.length;
    let spacePerLabel = xAxisWidth/labels.length;

    // drop labels if they would overlap the label before.
    // better solution would be: calculate the interval to know in what interval we can drop labels
    // then do this recursively by multiplying the interval until we have enough space
    labels.map((label, index) => {
      let spaceNeededBefore = 0;
      let i = index;
      while(i--) {
        if (labels[i]) {
          spaceNeededBefore = spaceNeededBefore + (labels[i].show ? labels[i].space : 0);
        }
      }
      if (spaceNeededBefore < (index + 1) * spacePerLabel) {
        label.show = true;
      } else {
        label.show = false;
      }
    })

  }

  config.axisX.labelInterpolationFnc = (value, index) => {
    if (dateSettingsForPrecisions.hasOwnProperty(typeOptions.precision)) {
      value = dateSettingsForPrecisions[typeOptions.precision].format(index, new Date(value));
    }

    if (labels[index].show) {
      return value;
    }
    return ' ';
  }
}

export var seriesTypes = {
  'date': {
    'x': {
      modifyConfig: modifyConfigDateX
    }
  }
}
