class TrackerService {
  constructor(opts = {}) {
    if (opts.trackers) {
      this.trackers = Object.keys(opts.trackers)
        .reduce((acc, key) => ({ ...acc, [key]: new opts.trackers[key](this) }), {});
    }
  }

  init() {
    Object.keys(this.trackers)
      .forEach((tracker) => this.trackers[tracker].init(this.trackers));
  }
}

module.exports = TrackerService;
