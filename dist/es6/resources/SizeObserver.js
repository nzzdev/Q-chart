export default class SizeObserver {

  resizeCallbacks = [];
  resizeListenerInstalled = false;

  onResize(callback, element = undefined) {
    this.resizeCallbacks.push({
      func: callback,
      element: element
    });
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

  setupResizeListener() {
    window.addEventListener('resize', this.handleResizeOnTick.bind(this));
    this.resizeListenerInstalled = true;
  }

  cancelResizeListener() {
    window.removeEventListener('resize', this.handleResizeOnTick.bind(this));
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
      if (cb.element && cb.element.getBoundingClientRect) {
        cb.func(cb.element.getBoundingClientRect());
      } else {
        cb.func();
      }
    }
  }
}
