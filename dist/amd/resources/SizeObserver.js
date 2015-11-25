define(['exports', 'module', 'raf'], function (exports, module, _raf) {
  'use strict';

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  var _raf2 = _interopRequireDefault(_raf);

  var SizeObserver = (function () {
    function SizeObserver() {
      _classCallCheck(this, SizeObserver);

      this.resizeCallbacks = [];
      this.resizeListenerInstalled = false;
    }

    _createClass(SizeObserver, [{
      key: 'onResize',
      value: function onResize(callback) {
        var element = arguments.length <= 1 || arguments[1] === undefined ? undefined : arguments[1];

        this.resizeCallbacks.push({
          func: callback,
          element: element
        });
        if (!this.resizeListener) {
          this.setupResizeListener();
          return (function () {
            var index = this.resizeCallbacks.indexOf(callback);
            if (index !== -1) {
              this.resizeCallbacks.splice(index, 1);
            }
            if (this.resizeCallbacks.length === 0) {
              this.cancelResizeListener();
            }
          }).bind(this);
        }
      }
    }, {
      key: 'setupResizeListener',
      value: function setupResizeListener() {
        window.addEventListener('resize', this.handleResizeOnTick.bind(this));
        this.resizeListenerInstalled = true;
      }
    }, {
      key: 'cancelResizeListener',
      value: function cancelResizeListener() {
        window.removeEventListener('resize', this.handleResizeOnTick.bind(this));
        this.resizeListenerInstalled = false;
      }
    }, {
      key: 'handleResizeOnTick',
      value: function handleResizeOnTick() {
        var _this = this;

        (0, _raf2['default'])((function () {
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = _this.resizeCallbacks[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var cb = _step.value;

              if (cb.element && cb.element.getBoundingClientRect) {
                cb.func(cb.element.getBoundingClientRect());
              } else {
                cb.func();
              }
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator['return']) {
                _iterator['return']();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }
        }).bind(this));
      }
    }]);

    return SizeObserver;
  })();

  module.exports = SizeObserver;
});