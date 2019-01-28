const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const chai = require('chai');

const { TrackerService } = require('../../../src/service');

const { expect } = chai;

chai.use(sinonChai);

describe('TrackerService', () => {
  describe('General', () => {
    it('should be importable', () => {
      expect(TrackerService).to.be.a('function');
    });

    it('should be constructable', () => {
      expect(new TrackerService).to.be.an.instanceof(TrackerService);
    });
  });

  describe('constructor()', () => {
    let MockTracker;

    beforeEach(() => {
      MockTracker = sinon.stub();
    });

    it('should instantiate trackers provided via `opts`', () => {
      const opts = { trackers: { a: MockTracker  } };

      const trackerService = new TrackerService(opts);

      expect(trackerService.trackers.a).to.be.an.instanceof(MockTracker);
      expect(MockTracker).to.be.calledWithExactly(trackerService);
    });

    it('should allow trackers to be instantiated with own `opts`', () => {
      const trackerOpts = { foo: 'bar' };
      const opts = { trackers: { a: { tracker: MockTracker, opts: trackerOpts } } };

      const trackerService = new TrackerService(opts);

      expect(trackerService.trackers.a).to.be.an.instanceof(MockTracker);
      expect(MockTracker).to.be.calledWithExactly(trackerService, trackerOpts);
    });
  });

  describe('Instance methods', () => {
    let trackerService;

    beforeEach(() => {
      trackerService = new TrackerService();
    });

    describe('init()', () => {
      it('should invoke the init() method on each tracker instance', () => {
        const init = sinon.spy();
        const trackers = { a: { init } };
        trackerService.trackers = trackers;

        trackerService.init();

        expect(init).to.be.calledWithExactly(trackers);
      });
    });

    describe('on()', () => {
      it('should correctly register the callback', () => {
        const cb = () => null;
        const eventName = 'foo';

        trackerService.on(eventName, cb);

        expect(trackerService._events[eventName]).to.eql([cb]);
      });
    });

    describe('emit()', () => {
      it('should invoke the callback(s) with the data provided', () => {
        const cb = sinon.spy();
        const eventName = 'foo';
        const payload = { foo: 'bar' };
        trackerService._events = { [eventName]: [cb] };

        trackerService.emit(eventName, payload);

        expect(cb).to.be.calledWithExactly(payload);
      });
    });
  });

  describe('Instance properties', () => {
    describe('instanceProperty', () => {
      // Make assertions about the instance property under test.
    });
  });
});

