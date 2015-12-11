function pad(value, toLength) {
  value = value.toString();
  while(toLength - value.toString().length > 0) {
    value = `0${value}`;
  }
  return value;
}

export var seriesTypeConfig = {
  year: {
    formatBasedOnIndex: (index, length, date) => {
      if (index === 0) {
        return date.getFullYear();
      } else {
        return date.getFullYear().toString().slice(2);
      }
    },
    getLabelLengthBasedOnIndex: (index, length, data, config) => {
      return index === 0 ? 40 : 23;
    },
    format: (date) => {
      return date.getFullYear();
    },
    getForceShow: (index, length, data, config, size) => {
      return index === 0 || index === length - 1;
    }
  },
  month: {
    formatBasedOnIndex: (index, length, date) => {
      if (index === 0 || index === length - 1 || date.getMonth() === 0) {
        return `${pad(date.getMonth()+1,2)}.${date.getFullYear()}`;
      } else {
        return `${pad(date.getMonth()+1,2)}`;
      }
    },
    getLabelLengthBasedOnIndex: (index, length, data, config) => {
      let date = new Date(data.labels[index]);
      if (index === 0 || index === length - 1 || date.getMonth() === 0) {
        return 60;
      }
      return 23;
    },
    format: (date) => {
      return `${pad(date.getMonth()+1,2)}.${date.getFullYear()}`;
    },
    getForceShow: (index, length, data, config, size) => {
      if (size === 'small') {
        return index === 0 || index === length - 1;
      } else {
        let date = new Date(data.labels[index]);
        return (index === 0 || index === length - 1 || date.getMonth() === 0);
      }
    }
  },
  day: {
    formatBasedOnIndex: (index, length, date) => {
      if (index === 0) {
        return `${pad(date.getDate(),2)}.${pad(date.getMonth()+1,2)}.${date.getFullYear()}`;
      } else {
        return `${pad(date.getDate(),2)}`;
      }
    },
    getLabelLengthBasedOnIndex: (index, length, data, config) => {
      return index === 0 ? 100 : 23;
    },
    format: (date) => {
      return `${pad(date.getDate(),2)}.${pad(date.getMonth()+1,2)}.${date.getFullYear()}`;
    },
    getForceShow: (index, length, data, config, size) => {
      return index === 0 || index === length - 1;
    }
  },
  hour: {
    formatBasedOnIndex: (index, length, date) => {
      return `${pad(date.getHours()+1,2)}:${pad(date.getMinutes(),2)}`;
    },
    getLabelLengthBasedOnIndex: (index, length, data, config) => {
      return 40;
    },
    format: (date) => {
      return `${pad(date.getHours()+1,2)}:${pad(date.getMinutes(),2)}`;
    },
    getForceShow: (index, length, data, config, size) => {
      return index === 0 || index === length - 1;
    }
  }
}
