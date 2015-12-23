import {setLabelsBasedOnIntervalAndAvailableSpace, setLabelsBasedOnInterval} from './seriesTypes/dateSeriesType';
import Chartist from 'chartist';

export var getLabelFontStyle = () => {
  if (window.matchMedia && window.matchMedia('(max-width: 413px)').matches) {
    return '11px Arial';
  } else {
    return '13px Arial';
  }
}

export var getDigitLabelFontStyle = () => {
  if (window.matchMedia && window.matchMedia('(max-width: 413px)').matches) {
    return '10px Lucida Sans Typewriter';
  } else {
    return '12px Lucida Sans Typewriter';
  }
}

export var seriesTypes = {
  'date': {
    'x': {
      'Line': {
        modifyData: setLabelsBasedOnIntervalAndAvailableSpace
      },
      'Bar': {
        modifyData: (config, type, data, size, rect) => {
          if (config.horizontalBars) {
            setLabelsBasedOnInterval(config, type, data, size, rect);
          } else {
            setLabelsBasedOnIntervalAndAvailableSpace(config, type, data, size, rect, getLabelFontStyle());
          }
        }
      },
      'StackedBar': {
        modifyData: (config, type, data, size, rect) => {
          if (config.horizontalBars) {
            setLabelsBasedOnInterval(config, type, data, size, rect);
          } else {
            setLabelsBasedOnIntervalAndAvailableSpace(config, type, data, size, rect, getLabelFontStyle());
          }
        }
      }
    },
    
  }
}
