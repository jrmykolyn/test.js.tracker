const { Events } = require('../../events');

class TrackerA {
  static get MAX_LOG_LENGTH() {
    return 10;
  }

  get DEFAULTS() {
    return {
      FOO: 1,
      BAR: 2,
      BAZ: 3,
      QUUX: 4,
    };
  }

  constructor(service, opts = {}) {
    this.log = [];
    this.service = service;
    this.opts = opts;

    // Instantiate handlers.
    this.handlers = Object.keys(opts.handlers || {})
      .reduce((acc, key) => ({
        ...acc,
        [key]: new opts.handlers[key](this),
      }), {});

    // TEMP: Expose augmentors.
    this.augmenters = {
      computeBar: this.computeBar.bind(this),
      computeBaz: this.computeBaz.bind(this),
      computeQuux: this.computeQuux.bind(this),
    };

    // Bind.
    this.doLog = this.doLog.bind(this);
  }

  init(trackers) {
    this.service.on(Events.EVENT_A, this.handlers.a.handleEventA.bind(this.handlers.a));
    this.service.on(Events.EVENT_AA, this.handlers.a.handleEventAA.bind(this.handlers.a));
  }

  doSetup(data = {}) {
    return {
      foo: 'bar',
      ...data,
    };
  }

  doAugment(data = {}) {
    return (augmenters = []) => (payload) => {
      return {
        ...payload,
        ...augmenters.reduce((acc, augmenter) => ({ ...acc, ...augmenter(data) }), {}),
      }
    };
  }

  doLink(payload) {
    console.log('__ LOGGING OUT `payload`', payload); // TEMP
    return payload;
  }

  doLog(payload) {
    this.log = [payload, ...this.log].slice(0, this.opts.maxLogLength || TrackerA.MAX_LOG_LENGTH);
  }

  computeBar(data = {}) {
    const defaultBar = this.DEFAULTS.BAR;
    return { bar: +data.bar ? defaultBar + (+data.bar) : defaultBar };
  }

  computeBaz(data = {}) {
    return { baz: 'quux' };
  }

  computeQuux(data = {}) {
    return { quux: 'foo' };
  }
}

module.exports = TrackerA;
