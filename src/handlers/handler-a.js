const { Utils } = require('../utils');

class HandlerA {
  constructor(tracker) {
    this.tracker = tracker;
  }

  handleEventA(data) {
    return Utils.pipe(
      { event: 'myEvent' },
      this.tracker.doSetup,
      this.tracker.doAugment(data)([
        this.tracker.augmenters.addBar,
        this.tracker.augmenters.addBaz,
      ]),
      this.tracker.doLink
    );
  }
}

module.exports = HandlerA;
