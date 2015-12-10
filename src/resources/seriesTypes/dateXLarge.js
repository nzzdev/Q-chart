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
    getLabelLength: (index, length, data, config) => {
      return index === 0 ? 40 : 23;
    },
    getPositionFactor: (index, length, data, config) => {
      return index === 0 ? 1 : 0.5;
    },
    getForceShow: (index, length, data, config) => {
      return index === 0 || index === length - 1;
    }
  },
  month: {
    format: (index, date) => {
      if (index === 0 || date.getMonth() === 0) {
        return `${pad(date.getMonth()+1,2)}.${date.getFullYear()}`;
      } else {
        return `${pad(date.getMonth()+1,2)}`;
      }
    },
    getLabelLength: (index, length, data, config) => {
      let date = new Date(data.labels[index]);
      if (index === 0 || date.getMonth() === 0) {
        return 60;
      }
      return 23;
    },
    getPositionFactor: (index, length, data, config) => {
      return (index === 0 || index === length -1) ? 1 : 0.5;
    },
    getForceShow: (index, length, data, config) => {
      let date = new Date(data.labels[index]);
      return (index === 0 || index === length - 1 || date.getMonth() === 0);
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
    getLabelLength: (index, length, data, config) => {
      return index === 0 ? 100 : 23;
    },
    getPositionFactor: (index, length, data, config) => {
      return index === 0 ? 1 : 0.5;
    },
    getForceShow: (index, length, data, config) => {
      return index === 0 || index === length - 1;
    }
  },
  hour: {
    format: (index, date) => {
      return `${pad(date.getHours()+1,2)}:${pad(date.getMinutes(),2)}`;
    },
    getLabelLength: (index, length, data, config) => {
      return 40;
    },
    getPositionFactor: (index, length, data, config) => {
      return index === 0 ? 1 : 0.5;
    },
    getForceShow: (index, length, data, config) => {
      return index === 0 || index === length - 1;
    }
  }
}

export function modifyConfigDateXLarge(config, typeOptions, data, size, rect) {
  // this should only run if we don't have horizontalBars
  if (config.horizontalBars) {
    if (config.axisX && config.axisX.labelInterpolationFnc) {
      delete config.axisX.labelInterpolationFnc;
    }
    return;
  }

  // the ticks model
  var ticks = new Array(data.labels.length);

  config.axisX = config.axisX || {};

  // get all the information for the labels
  var labels = data.labels.map((label, index) => {
    return {
      space: dateSettingsForPrecisions[typeOptions.precision].getLabelLength(index, data.labels.length, data, config),
      positionFactor: dateSettingsForPrecisions[typeOptions.precision].getPositionFactor(index, data.labels.length, data, config),
      forceShow: dateSettingsForPrecisions[typeOptions.precision].getForceShow(index, data.labels.length, data, config),
    }
  });

  let xAxisWidth = rect.width - ((config.axisX.offset || 30) + 10);

  // do we have space for all the labels?
  let enoughSpace = labels.reduce((sum, label) => { return sum + label.space; }, 0) < xAxisWidth;

  if (enoughSpace) {

    labels.map((label, index) => ticks[index] = label);

  } else {

    let numberOfLabels = data.labels.length;
    let tickDistance = xAxisWidth/labels.length;

    // first set the forced labels
    labels.map((label, index) => {
      if (label.forceShow) {
        ticks[index] = label;
      }
    })

    // then fill up with labels, if we have enough space before and after the forced ones
    labels.map((label, index) => {
      if (!label.forceShow) {
        // check if our space is free
        let spaceIsFree = true;
        let spaceToTickStart = ((index+1) * tickDistance) - (label.positionFactor * label.space);
        let i = index;
        while(i--) {
          let endOfLastTick = 0;
          if (ticks[i]) {
            let endOfLastTick = (i * tickDistance) + (ticks[i].positionFactor * ticks[i].space);
            if (endOfLastTick > spaceToTickStart) {
              spaceIsFree = false;
            }
          }
        }
        i = index;
        while(i++ <= labels.length) {
          let startOfNextTick = labels.length * tickDistance; // init to the end
          if (ticks[i]) {
            let startOfNextTick = (i * tickDistance) - (ticks[i].positionFactor * ticks[i].space);
            if (startOfNextTick < spaceToTickStart + (label.positionFactor * label.space)) {
              spaceIsFree = false;
            }
          }
        }
        if (spaceIsFree) {
          ticks[index] = label;
        }
      }
    });
  }

  config.axisX.labelInterpolationFnc = (value, index) => {
    if (dateSettingsForPrecisions.hasOwnProperty(typeOptions.precision)) {
      value = dateSettingsForPrecisions[typeOptions.precision].format(index, new Date(value));
    }

    if (ticks[index]) {
      return value;
    }
    // uncomment this to force grid lines on every tick
    // return ' ';
  }
}
