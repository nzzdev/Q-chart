import {setLabelsBasedOnIntervalAndAvailableSpace, setLabelsBasedOnInterval} from './seriesTypes/dateSeriesType';
import {getLabelWidth} from './seriesTypes/helpers';
import Chartist from 'chartist';
import max from './max';

var getLabelFontStyle = () => {
  if (window.matchMedia && window.matchMedia('(max-width: 413px)').matches) {
    return '11px Arial';
  } else {
    return '13px Arial';
  }
}

var getDigitLabelFontStyle = () => {
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
            setLabelsBasedOnInterval(config, typeOptions, data, size, rect, getLabelFontStyle);
          } else {
            setLabelsBasedOnIntervalAndAvailableSpace(config, typeOptions, data, size, rect, getLabelFontStyle);
          }
        }
      },
      'StackedBar': {
        modifyData: (config, typeOptions, data, size, rect) => {
          if (config.horizontalBars) {
            setLabelsBasedOnInterval(config, typeOptions, data, size, rect, getLabelFontStyle);
          } else {
            setLabelsBasedOnIntervalAndAvailableSpace(config, typeOptions, data, size, rect, getLabelFontStyle);
          }
        }
      }
    },
    
  },
  'number': {
    'x': {
      modifyConfig: (config, typeOptions, data, size, rect) => {
        let divider;

        let flatDatapoints = data.series
          .reduce((a, b) => a.concat(b))
          .sort((a, b) => parseFloat(a) - parseFloat(b));

        let medianValue = (flatDatapoints.length % 2 === 0) ? flatDatapoints[flatDatapoints.length / 2 - 1] : flatDatapoints[flatDatapoints.length - 1 / 2];
        let maxValue    = flatDatapoints[flatDatapoints.length - 1];

        // use the median value to calculate the divider
        if (medianValue >= Math.pow(10,9)) {
          divider = Math.pow(10,9)
        } else if (medianValue >= Math.pow(10,6)) {
          divider = Math.pow(10,6)
        } else if (medianValue >= Math.pow(10,3)) {
          divider = Math.pow(10,3);
        }

        // the max label is the maxvalue rounded up, doesn't need to be perfectly valid, just stay on the save side regarding space
        let maxLabel = Math.ceil(maxValue / Math.pow(10,maxValue.length)) * Math.pow(10,maxValue.length);

        config.axisX.scaleMinSpace = getLabelWidth(maxLabel/divider, getDigitLabelFontStyle) * 1.5;

        config.axisX.labelInterpolationFnc = (value, index) => {
          return value / divider;
        }
      }
    }
  }
}
