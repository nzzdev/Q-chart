import raf from 'raf';

export default class SizeObserver {

  resizeCallbacks = [];
  resizeListenerInstalled = false;

  onResize(callback) {
    this.resizeCallbacks.push(callback);
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
    raf(() => {
      var width = window.innerWidth
                  || document.documentElement.clientWidth
                  || document.body.clientWidth;
      for (let cb of this.resizeCallbacks) {
        cb(width);
      }
    }.bind(this));
  }

}
