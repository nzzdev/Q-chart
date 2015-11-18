System.register(['./env', 'aurelia-framework', 'aurelia-binding', 'computed-style-to-inline-style', 'papaparse', './styles.css!', './defaultValues', './display'], function (_export) {
  'use strict';

  var env, useView, inject, ObserverLocator, computedToInline, Papa, defaultValues, displayChart, ToolboxChart;

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  return {
    setters: [function (_env) {
      env = _env['default'];
    }, function (_aureliaFramework) {
      useView = _aureliaFramework.useView;
      inject = _aureliaFramework.inject;
    }, function (_aureliaBinding) {
      ObserverLocator = _aureliaBinding.ObserverLocator;
    }, function (_computedStyleToInlineStyle) {
      computedToInline = _computedStyleToInlineStyle['default'];
    }, function (_papaparse) {
      Papa = _papaparse['default'];
    }, function (_stylesCss) {}, function (_defaultValues) {
      defaultValues = _defaultValues['default'];
    }, function (_display) {
      displayChart = _display.display;
    }],
    execute: function () {
      ToolboxChart = (function () {
        function ToolboxChart(observerLocator, item) {
          _classCallCheck(this, _ToolboxChart);

          this.chartTypes = ['Line', 'Bar'];
          this.actions = [{
            onClick: this.save.bind(this),
            label: 'speichern'
          }];

          this.env = env;

          this.observerLocator = observerLocator;
          this.item = item;
        }

        _createClass(ToolboxChart, [{
          key: 'activate',
          value: function activate(routeParams) {
            var _this = this;

            return new Promise(function (resolve, reject) {
              if (routeParams && routeParams.id) {
                _this.item.load(routeParams.id).then(function () {
                  _this.addObservers();
                  resolve();
                });
              } else {
                _this.item.setConf(defaultValues);
                _this.addObservers();
                resolve();
              }
            });
          }
        }, {
          key: 'attached',
          value: function attached() {
            this.drawChart();
          }
        }, {
          key: 'addObservers',
          value: function addObservers() {
            this.observerLocator.getObserver(this.item.conf, 'chartType').subscribe(this.drawChart.bind(this));

            this.observerLocator.getObserver(this.item.conf, 'data').subscribe(this.drawChart.bind(this));
          }
        }, {
          key: 'updateData',
          value: function updateData() {
            this.item.conf.data = Object.assign({}, this.item.conf.data);
          }
        }, {
          key: 'drawChart',
          value: function drawChart() {
            if (!this.item.conf || !this.item.conf.chartType || !this.chartElement) return;

            try {
              this.chart = displayChart(this.item.conf, this.chartElement);
            } catch (e) {
              console.log('ERROR', e);
            }
          }
        }, {
          key: 'utf8_to_b64',
          value: function utf8_to_b64(str) {
            return window.btoa(unescape(encodeURIComponent(str)));
          }
        }, {
          key: 'b64_to_utf8',
          value: function b64_to_utf8(str) {
            return decodeURIComponent(escape(window.atob(str)));
          }
        }, {
          key: 'save',
          value: function save() {
            return this.item.save().then(function (args) {
              console.log('saved', args);
            });
          }
        }]);

        var _ToolboxChart = ToolboxChart;
        ToolboxChart = inject(ObserverLocator, 'Item')(ToolboxChart) || ToolboxChart;
        ToolboxChart = useView('./base.html')(ToolboxChart) || ToolboxChart;
        return ToolboxChart;
      })();

      _export('ToolboxChart', ToolboxChart);
    }
  };
});