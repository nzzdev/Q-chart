'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _env = require('./env');

var _env2 = _interopRequireDefault(_env);

var _aureliaFramework = require('aurelia-framework');

var _aureliaBinding = require('aurelia-binding');

var _computedStyleToInlineStyle = require('computed-style-to-inline-style');

var _computedStyleToInlineStyle2 = _interopRequireDefault(_computedStyleToInlineStyle);

var _papaparse = require('papaparse');

var _papaparse2 = _interopRequireDefault(_papaparse);

require('./styles.css!');

var _resourcesDefaultValues = require('./resources/defaultValues');

var _resourcesDefaultValues2 = _interopRequireDefault(_resourcesDefaultValues);

var _display = require('./display');

var ToolboxChart = (function () {
  function ToolboxChart(observerLocator, item) {
    _classCallCheck(this, _ToolboxChart);

    this.chartTypes = ['Line', 'Bar'];
    this.actions = [{
      onClick: this.save.bind(this),
      label: 'speichern'
    }];

    this.env = _env2['default'];

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
          _this.item.setConf(_resourcesDefaultValues2['default']);
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
        this.chart = (0, _display.display)(this.item.conf, this.chartElement);
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
  ToolboxChart = (0, _aureliaFramework.inject)(_aureliaBinding.ObserverLocator, 'Item')(ToolboxChart) || ToolboxChart;
  return ToolboxChart;
})();

exports.ToolboxChart = ToolboxChart;