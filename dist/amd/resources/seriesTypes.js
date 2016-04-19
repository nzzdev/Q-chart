define(['exports', './seriesTypes/dateSeriesType', 'chartist', '../chartist-plugins/chartist-plugin-prognosis-split'], function (exports, _seriesTypesDateSeriesType, _chartist, _chartistPluginsChartistPluginPrognosisSplit) {
  'use strict';

  Object.defineProperty(exports, '__esModule', {
    value: true
  });

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _Chartist = _interopRequireDefault(_chartist);

  var getLabelFontStyle = function getLabelFontStyle() {
    if (window.matchMedia && window.matchMedia('(max-width: 413px)').matches) {
      return '11px Arial';
    } else {
      return '13px Arial';
    }
  };

  exports.getLabelFontStyle = getLabelFontStyle;
  var getDigitLabelFontStyle = function getDigitLabelFontStyle() {
    if (window.matchMedia && window.matchMedia('(max-width: 413px)').matches) {
      return '10px Lucida Sans Typewriter';
    } else {
      return '12px Lucida Sans Typewriter';
    }
  };

  exports.getDigitLabelFontStyle = getDigitLabelFontStyle;
  var seriesTypes = {
    'date': {
      'x': {
        'Line': {
          modifyData: _seriesTypesDateSeriesType.setLabelsBasedOnIntervalAndAvailableSpace,
          modifyConfig: function modifyConfig(config, type, data, size, rect, item) {
            try {
              var prognosisStart = item.data.x.type.options.prognosisStart;

              if (typeof prognosisStart != 'undefined') {
                var labels = data.labels;

                var numLabels = labels.length;
                config.plugins.push((0, _chartistPluginsChartistPluginPrognosisSplit.ctPrognosisSplit)({
                  threshold: prognosisStart / (numLabels - 1)
                }));
              }
            } catch (e) {}
          }
        },
        'Bar': {
          modifyData: function modifyData(config, type, data, size, rect) {
            if (config.horizontalBars) {
              (0, _seriesTypesDateSeriesType.setLabelsBasedOnInterval)(config, type, data, size, rect);
            } else {
              (0, _seriesTypesDateSeriesType.setLabelsBasedOnIntervalAndAvailableSpace)(config, type, data, size, rect, getLabelFontStyle());
            }
          },
          modifyConfig: function modifyConfig(config, type, data, size, rect, item) {
            try {
              var prognosisStart = item.data.x.type.options.prognosisStart;

              if (typeof prognosisStart != 'undefined') {
                config.plugins.push((0, _chartistPluginsChartistPluginPrognosisSplit.ctPrognosisSplit)({
                  index: prognosisStart,
                  hasSwitchedAxisCount: !!(item.options && !item.options.isColumnChart)
                }));
              }
            } catch (e) {}
          }
        },
        'StackedBar': {
          modifyData: function modifyData(config, type, data, size, rect) {
            if (config.horizontalBars) {
              (0, _seriesTypesDateSeriesType.setLabelsBasedOnInterval)(config, type, data, size, rect);
            } else {
              (0, _seriesTypesDateSeriesType.setLabelsBasedOnIntervalAndAvailableSpace)(config, type, data, size, rect, getLabelFontStyle());
            }
          },
          modifyConfig: function modifyConfig(config, type, data, size, rect, item) {
            try {
              var prognosisStart = item.data.x.type.options.prognosisStart;

              if (typeof prognosisStart != 'undefined') {
                config.plugins.push((0, _chartistPluginsChartistPluginPrognosisSplit.ctPrognosisSplit)({
                  index: prognosisStart,
                  hasSwitchedAxisCount: !!(item.options && !item.options.isColumnChart)
                }));
              }
            } catch (e) {}
          }
        }
      }

    }
  };
  exports.seriesTypes = seriesTypes;
});