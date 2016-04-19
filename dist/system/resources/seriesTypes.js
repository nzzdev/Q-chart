System.register(['./seriesTypes/dateSeriesType', 'chartist', '../chartist-plugins/chartist-plugin-prognosis-split'], function (_export) {
  'use strict';

  var setLabelsBasedOnIntervalAndAvailableSpace, setLabelsBasedOnInterval, Chartist, ctPrognosisSplit, getLabelFontStyle, getDigitLabelFontStyle, seriesTypes;
  return {
    setters: [function (_seriesTypesDateSeriesType) {
      setLabelsBasedOnIntervalAndAvailableSpace = _seriesTypesDateSeriesType.setLabelsBasedOnIntervalAndAvailableSpace;
      setLabelsBasedOnInterval = _seriesTypesDateSeriesType.setLabelsBasedOnInterval;
    }, function (_chartist) {
      Chartist = _chartist['default'];
    }, function (_chartistPluginsChartistPluginPrognosisSplit) {
      ctPrognosisSplit = _chartistPluginsChartistPluginPrognosisSplit.ctPrognosisSplit;
    }],
    execute: function () {
      getLabelFontStyle = function getLabelFontStyle() {
        if (window.matchMedia && window.matchMedia('(max-width: 413px)').matches) {
          return '11px Arial';
        } else {
          return '13px Arial';
        }
      };

      _export('getLabelFontStyle', getLabelFontStyle);

      getDigitLabelFontStyle = function getDigitLabelFontStyle() {
        if (window.matchMedia && window.matchMedia('(max-width: 413px)').matches) {
          return '10px Lucida Sans Typewriter';
        } else {
          return '12px Lucida Sans Typewriter';
        }
      };

      _export('getDigitLabelFontStyle', getDigitLabelFontStyle);

      seriesTypes = {
        'date': {
          'x': {
            'Line': {
              modifyData: setLabelsBasedOnIntervalAndAvailableSpace,
              modifyConfig: function modifyConfig(config, type, data, size, rect, item) {
                try {
                  var prognosisStart = item.data.x.type.options.prognosisStart;

                  if (prognosisStart != 'undefined' && typeof prognosisStart != 'undefined') {
                    var labels = data.labels;

                    var numLabels = labels.length;
                    config.plugins.push(ctPrognosisSplit({
                      threshold: prognosisStart / (numLabels - 1)
                    }));
                  }
                } catch (e) {}
              }
            },
            'Bar': {
              modifyData: function modifyData(config, type, data, size, rect) {
                if (config.horizontalBars) {
                  setLabelsBasedOnInterval(config, type, data, size, rect);
                } else {
                  setLabelsBasedOnIntervalAndAvailableSpace(config, type, data, size, rect, getLabelFontStyle());
                }
              },
              modifyConfig: function modifyConfig(config, type, data, size, rect, item) {
                try {
                  var prognosisStart = item.data.x.type.options.prognosisStart;

                  if (prognosisStart != 'undefined' && typeof prognosisStart != 'undefined') {
                    config.plugins.push(ctPrognosisSplit({
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
                  setLabelsBasedOnInterval(config, type, data, size, rect);
                } else {
                  setLabelsBasedOnIntervalAndAvailableSpace(config, type, data, size, rect, getLabelFontStyle());
                }
              },
              modifyConfig: function modifyConfig(config, type, data, size, rect, item) {
                try {
                  var prognosisStart = item.data.x.type.options.prognosisStart;

                  if (prognosisStart != 'undefined' && typeof prognosisStart != 'undefined') {
                    config.plugins.push(ctPrognosisSplit({
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

      _export('seriesTypes', seriesTypes);
    }
  };
});