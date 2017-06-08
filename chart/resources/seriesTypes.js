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
    return '11px Arial';
  } else {
    return '13px Arial';
  }
}

export var seriesTypes = {
  'date': {
    'x': {
      'Line': {
        modifyData: setLabelsBasedOnIntervalAndAvailableSpace,
        modifyConfig: (config, type, data, size, rect, item) => {
          try {
            let {prognosisStart} = item.dataSeriesType.options;
            if (prognosisStart !== undefined) {
              let {labels} = data;
              let numLabels = labels.length;
              config.plugins.push(ctPrognosisSplit({
                prognosisStart: prognosisStart,
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
            let {prognosisStart} = item.dataSeriesType.options;
            if (prognosisStart !== undefined) {
              config.plugins.push(ctPrognosisSplit({
                prognosisStart: prognosisStart,
                hasSwitchedAxisCount: config.horizontalBars
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
            let {prognosisStart} = item.dataSeriesType.options;
            if (prognosisStart !== undefined) {
              config.plugins.push(ctPrognosisSplit({
                prognosisStart: prognosisStart,
                hasSwitchedAxisCount: config.horizontalBars
              }));
            }
          } catch(e) {
          }
        }
      }
    },
  }
}
