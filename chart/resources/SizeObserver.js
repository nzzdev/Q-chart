function debounce(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this, args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

export default class SizeObserver {

  resizeCallbacks = [];
  resizeListenerInstalled = false;

  elementRectCheckIntervals = {};
  lastSeenElementRects = {};

  constructor() {
    this.resizeHandler = debounce(this.handleResizeOnTick.bind(this), 250);
  }

  onResize(callback, element = undefined, runOnceImmediately = false) {
    let newLength = this.resizeCallbacks.push({
      func: callback,
      element: element
    });

    if (runOnceImmediately) {
      this.invokeCallback(this.resizeCallbacks[newLength-1]);
    }

    if (!this.resizeListener) {
      this.setupResizeListener();
      return function() {
        let index = this.resizeCallbacks.indexOf(callback);
        if (index !== -1) {
          this.resizeCallbacks.splice(index, 1);
        }
        if (this.resizeCallbacks.length === 0) {
          this.cancelResizeListener();
        }
        
      }.bind(this);
    }
  }

  onElementRectChange(callback, element) {
    if (element && element.getBoundingClientRect) {
      this.setupElementRectObserver(element, callback);
    }
    return function() {
      if (this.elementRectCheckIntervals[element]) {
        window.clearInterval(this.elementRectCheckIntervals[element]);
      }
    }
  }

  setupElementRectObserver(element, cb) {
    this.elementRectCheckIntervals[element] = window.setInterval(() => {
      if (window.requestAnimationFrame) {
        requestAnimationFrame(() => {
          let rect = this.getRectIfNotTheSame(element);
          if (rect) {
            cb(rect);
          }
        });
      } else {
        let rect = this.getRectIfNotTheSame(element);
        if (rect) {
          cb(rect);
        }
      }
    },500);
  }

  getRectIfNotTheSame(element) {
    let newRect = element.getBoundingClientRect();
    if (this.lastSeenElementRects[element]) {
      if (this.lastSeenElementRects[element].width !== newRect.width
          || this.lastSeenElementRects[element].height !== newRect.height) {
        this.lastSeenElementRects[element] = newRect;
        return newRect;
      }
    } else {
      this.lastSeenElementRects[element] = newRect;
      return newRect;
    }
    return undefined;
  }

  setupResizeListener() {
    window.addEventListener('resize', this.resizeHandler);
    this.resizeListenerInstalled = true;
  }

  cancelResizeListener() {
    window.removeEventListener('resize', this.resizeHandler);
    this.resizeListenerInstalled = false;
  }

  handleResizeOnTick() {
    if (window.requestAnimationFrame) {
      requestAnimationFrame(this.invokeCallbacks.bind(this));
    } else {
      this.invokeCallbacks();
    }
  }

  invokeCallbacks() {
    for (let cb of this.resizeCallbacks) {
      this.invokeCallback(cb);
    }
  }

  invokeCallback(cb) {
    if (cb.element && cb.element.getBoundingClientRect) {

      cb.func(cb.element.getBoundingClientRect());
    } else {
      cb.func();
    }
  }
}
