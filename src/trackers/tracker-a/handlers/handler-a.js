const { Utils } = require('../../../utils');

class HandlerA {
  constructor(tracker) {
    this.tracker = tracker;
  }

  handleEventA(data) {
    return Utils.pipe(
      { event: 'myEvent' },
      this.tracker.doSetup,
      this.tracker.doAugment(data)([
        this.tracker.augmenters.computeBar,
        this.tracker.augmenters.computeBaz,
      ]),
      this.tracker.doLink,
      this.tracker.doLog
    );
  }

  handleEventAA(data) {
    return Utils.pipe(
      { event: 'myAAEvent' },
      this.tracker.doSetup,
      this.tracker.doAugment(data)([
        this.tracker.augmenters.computeQuux,
      ]),
      this.tracker.doLink,
      this.tracker.doLog
    );
  }
}

module.exports = HandlerA;
