import {setLabelsBasedOnIntervalAndAvailableSpace, setLabelsBasedOnInterval} from './seriesTypes/dateSeriesType';

export var seriesTypes = {
  'date': {
    'x': {
      'Line': {
        modifyData: setLabelsBasedOnIntervalAndAvailableSpace
      },
      'Bar': {
        modifyData: (config, typeOptions, data, size, rect) => {
          if (config.horizontalBars) {
            setLabelsBasedOnInterval(config, typeOptions, data, size, rect);
          } else {
            setLabelsBasedOnIntervalAndAvailableSpace(config, typeOptions, data, size, rect);
          }
        }
      },
      'StackedBar': {
        modifyData: (config, typeOptions, data, size, rect) => {
          if (config.horizontalBars) {
            setLabelsBasedOnInterval(config, typeOptions, data, size, rect);
          } else {
            setLabelsBasedOnIntervalAndAvailableSpace(config, typeOptions, data, size, rect);
          }
        }
      }
    }
  }
}
