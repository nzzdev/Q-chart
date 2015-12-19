import {setLabelsBasedOnIntervalAndAvailableSpace, setLabelsBasedOnInterval} from './seriesTypes/dateSeriesType';
import Chartist from 'chartist';
import max from './max';

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
        modifyData: (config, typeOptions, data, size, rect) => {
          if (config.horizontalBars) {
            setLabelsBasedOnInterval(config, typeOptions, data, size, rect);
          } else {
            setLabelsBasedOnIntervalAndAvailableSpace(config, typeOptions, data, size, rect, getLabelFontStyle());
          }
        }
      },
      'StackedBar': {
        modifyData: (config, typeOptions, data, size, rect) => {
          if (config.horizontalBars) {
            setLabelsBasedOnInterval(config, typeOptions, data, size, rect);
          } else {
            setLabelsBasedOnIntervalAndAvailableSpace(config, typeOptions, data, size, rect, getLabelFontStyle());
          }
        }
      }
    },
    
  }
}
