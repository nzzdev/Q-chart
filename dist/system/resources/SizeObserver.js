System.register([], function (_export) {
  'use strict';

  var SizeObserver;

  var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

  function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

  function debounce(func, wait, immediate) {
    var timeout;
    return function () {
      var context = this,
          args = arguments;
      var later = function later() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  }return {
    setters: [],
    execute: function () {
      ;

      SizeObserver = (function () {
        function SizeObserver() {
          _classCallCheck(this, SizeObserver);

          this.resizeCallbacks = [];
          this.resizeListenerInstalled = false;

          this.resizeHandler = debounce(this.handleResizeOnTick.bind(this), 250);
        }

        _createClass(SizeObserver, [{
          key: 'onResize',
          value: function onResize(callback) {
            var element = arguments.length <= 1 || arguments[1] === undefined ? undefined : arguments[1];
            var runOnceImmediately = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

            var newLength = this.resizeCallbacks.push({
              func: callback,
              element: element
            });

            if (runOnceImmediately) {
              this.invokeCallback(this.resizeCallbacks[newLength - 1]);
            }

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
            window.addEventListener('resize', this.resizeHandler);
            this.resizeListenerInstalled = true;
          }
        }, {
          key: 'cancelResizeListener',
          value: function cancelResizeListener() {
            window.removeEventListener('resize', this.resizeHandler);
            this.resizeListenerInstalled = false;
          }
        }, {
          key: 'handleResizeOnTick',
          value: function handleResizeOnTick() {
            if (window.requestAnimationFrame) {
              requestAnimationFrame(this.invokeCallbacks.bind(this));
            } else {
              this.invokeCallbacks();
            }
          }
        }, {
          key: 'invokeCallbacks',
          value: function invokeCallbacks() {
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
              for (var _iterator = this.resizeCallbacks[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var cb = _step.value;

                this.invokeCallback(cb);
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
          }
        }, {
          key: 'invokeCallback',
          value: function invokeCallback(cb) {
            if (cb.element && cb.element.getBoundingClientRect) {
              cb.func(cb.element.getBoundingClientRect());
            } else {
              cb.func();
            }
          }
        }]);

        return SizeObserver;
      })();

      _export('default', SizeObserver);
    }
  };
});