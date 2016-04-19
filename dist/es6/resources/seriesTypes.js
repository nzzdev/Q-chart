import {setLabelsBasedOnIntervalAndAvailableSpace, setLabelsBasedOnInterval} from './seriesTypes/dateSeriesType';
import Chartist from 'chartist';
import {ctPrognosisSplit} from '../chartist-plugins/chartist-plugin-prognosis-split'

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
        modifyData: setLabelsBasedOnIntervalAndAvailableSpace,
        modifyConfig: (config, type, data, size, rect, item) => {
          try {
            let {prognosisStart} = item.data.x.type.options;
            if (prognosisStart != 'undefined' && typeof prognosisStart != 'undefined') {
              let {labels} = data;
              let numLabels = labels.length;
              config.plugins.push(ctPrognosisSplit({
                threshold: (prognosisStart) / (numLabels-1)
              }));
            }
          } catch(e) {
          }
        }
      },
      'Bar': {
        modifyData: (config, type, data, size, rect) => {
          if (config.horizontalBars) {
            setLabelsBasedOnInterval(config, type, data, size, rect);
          } else {
            setLabelsBasedOnIntervalAndAvailableSpace(config, type, data, size, rect, getLabelFontStyle());
          }
        },
        modifyConfig: (config, type, data, size, rect, item) => {
          try {
            let {prognosisStart} = item.data.x.type.options;
            if (prognosisStart != 'undefined' && typeof prognosisStart != 'undefined') {
              config.plugins.push(ctPrognosisSplit({
                index: prognosisStart,
                hasSwitchedAxisCount: !!(item.options && !item.options.isColumnChart)
              }));
            }
          } catch(e) {
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
        },
        modifyConfig: (config, type, data, size, rect, item) => {
          try {
            let {prognosisStart} = item.data.x.type.options;
            if (prognosisStart != 'undefined' && typeof prognosisStart != 'undefined') {
              config.plugins.push(ctPrognosisSplit({
                index: prognosisStart,
                hasSwitchedAxisCount: !!(item.options && !item.options.isColumnChart)
              }));
            }
          } catch(e) {
          }
        }
      }
    },

  }
}
