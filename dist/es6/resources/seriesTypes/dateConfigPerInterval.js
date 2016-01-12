function pad(value, toLength) {
  value = value.toString();
  while(toLength - value.toString().length > 0) {
    value = `0${value}`;
  }
  return value;
}

var months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];


export var seriesTypeConfig = {
  year: {
    format: (index, isLastIntervalLabel, date, forceFull = false) => {
      if (index === 0 || isLastIntervalLabel || forceFull) {
        return date.getFullYear();
      } else {
        return date.getFullYear().toString().slice(2);
      }
    },
    getLabelLength: (index, isLastIntervalLabel, data, config) => {
      return (index === 0 || isLastIntervalLabel) ? 40 : 23;
    },
    getForceShow: (index, isLastIntervalLabel, data, config, size) => {
      return (index === 0 || isLastIntervalLabel);
    }
  },
  quarter: {
    format: (index, isLastIntervalLabel, date, forceFull = false) => {
      if (index === 0 || isLastIntervalLabel || forceFull) {
        return date.getFullYear() + ' Q' + (date.getMonth()/3 + 1);
      } else {
        return date.getFullYear().toString().slice(2) + ' Q' + (date.getMonth()/3 + 1);
      }
    },
    getLabelLength: (index, isLastIntervalLabel, data, config) => {
      return (index === 0 || isLastIntervalLabel) ? 40 : 23;
    },
    getForceShow: (index, isLastIntervalLabel, data, config, size) => {
      return (index === 0 || isLastIntervalLabel);
    }
  },
  month: {
    format: (index, isLastIntervalLabel, date, forceFull = false) => {
      if (index === 0 || isLastIntervalLabel || forceFull) {
        return `${months[date.getMonth()]} ${date.getFullYear()}`;
      } else {
        return `${months[date.getMonth()].slice(0,1)} ${date.getFullYear()}`;
      }
    },
    getLabelLength: (index, isLastIntervalLabel, data, config) => {
      let date = new Date(data.labels[index]);
      if (index === 0 || isLastIntervalLabel) {
        return 60;
      }
      return 23;
    },
    getForceShow: (index, isLastIntervalLabel, data, config, size) => {
      return (index === 0 || isLastIntervalLabel);
    }
  },
  day: {
    format: (index, isLastIntervalLabel, date, forceFull = false) => {
      if (index === 0 || isLastIntervalLabel || forceFull) {
        return `${pad(date.getDate(),2)}.${pad(date.getMonth()+1,2)}.${date.getFullYear()}`;
      } else {
        return `${pad(date.getDate(),2)}.${pad(date.getMonth()+1,2)}`;
      }
    },
    getLabelLength: (index, isLastIntervalLabel, data, config) => {
      return (index === 0 || isLastIntervalLabel) ? 100 : 40;
    },
    getForceShow: (index, isLastIntervalLabel, data, config, size) => {
      return (index === 0 || isLastIntervalLabel);
    }
  },
  hour: {
    format: (index, isLastIntervalLabel, date, forceFull = false) => {
      return `${pad(date.getHours()+1,2)}:${pad(date.getMinutes(),2)}`;
    },
    getLabelLength: (index, isLastIntervalLabel, data, config) => {
      return 40;
    },
    getForceShow: (index, isLastIntervalLabel, data, config, size) => {
      return (index === 0 || isLastIntervalLabel);
    }
  }
}
