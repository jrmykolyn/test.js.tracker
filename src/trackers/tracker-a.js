class TrackerA {
  constructor(service, opts) {
    this.service = service;
    this.opts = opts;

    // TEMP: Expose augmentors.
    this.augmenters = {
      addBar: this.addBar,
      addBaz: this.addBaz,
    };
  }

  init(trackers) {
    // TODO
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
