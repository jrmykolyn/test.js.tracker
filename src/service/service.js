class TrackerService {
  constructor(opts = {}) {
    if (opts.trackers) {
      this.trackers = Object.keys(opts.trackers)
        .reduce((acc, key) => {
          let instance = typeof opts.trackers[key] === 'function'
            ? new opts.trackers[key](this)
            : new opts.trackers[key].tracker(this, opts.trackers[key].opts || {})

          return { ...acc, [key]: instance };
        }, {});
    }
  }

  init() {
    Object.keys(this.trackers)
      .forEach((tracker) => this.trackers[tracker].init(this.trackers));
  }

  on(eventName, callback) {
    this._events = this._events || {};
    this._events[eventName] = this._events[eventName] || [];

    if (typeof callback === 'function') {
      this._events[eventName].push(callback);
    }
  }

  emit(eventName, payload) {
    this._events = this._events || {};
    this._events[eventName] = this._events[eventName] || [];

    this._events[eventName].forEach((callback) => callback(payload));
  }
}

module.exports = TrackerService;
