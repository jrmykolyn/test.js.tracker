const { Events } = require('../events');

class TrackerA {
  constructor(service, opts) {
    this.service = service;
    this.opts = opts;

    // Instantiate handlers.
    this.handlers = Object.keys(opts.handlers)
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
    return (augmenters) => (payload) => {
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
