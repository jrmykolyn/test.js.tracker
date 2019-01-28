const { Events } = require('../../events');

class TrackerA {
  static get MAX_LOG_LENGTH() {
    return 10;
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
      addBar: this.addBar,
      addBaz: this.addBaz,
      addQuux: this.addQuux,
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

  doAugment(data) {
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

  addBar(data) {
    return { bar: 'baz' };
  }

  addBaz(data) {
    return { baz: 'quux' };
  }

  addQuux(data) {
    return { quux: 'foo' };
  }
}

module.exports = TrackerA;
