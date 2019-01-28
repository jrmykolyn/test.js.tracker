const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const chai = require('chai');

const { TrackerA } = require('../../../src/trackers');
const { Events } = require('../../../src/events');

const { expect } = chai;

chai.use(sinonChai);

describe('TrackerA', () => {
  describe('General', () => {
    it('should be importable', () => {
      expect(TrackerA).to.be.a('function');
    });

    it('should be constructable', () => {
      expect(new TrackerA).to.be.an.instanceof(TrackerA);
    });
  });

  describe('constructor()', () => {
    let bind;
    let cb = () => null;
    let originalDoLog = TrackerA.prototype.doLog;

    beforeEach(() => {
      bind = sinon.spy(() => cb);
      TrackerA.prototype.doLog = { bind };
    });

    afterEach(() => {
      TrackerA.prototype.doLog = originalDoLog;
    });
    it('should assign the `service` property', () => {
      const service = { foo: 'bar' };

      expect(new TrackerA(service).service).to.eq(service);
    });

    it('should assign the `opts` property to the default value', () => {
      expect(new TrackerA().opts).to.eql({});
    });

    it('should assign the `opts` property', () => {
      const opts = { foo: 'bar' };

      expect(new TrackerA({}, opts).opts).to.eql(opts);
    });

    it('should instantiate the handlers provided via `opts`', () => {
      const MockHandler = sinon.spy();
      const opts = { handlers: { a: MockHandler } };

      const trackerA = new TrackerA({}, opts);

      expect(trackerA.handlers).to.be.a('object');
      expect(trackerA.handlers.a).to.be.an.instanceof(MockHandler);
      expect(MockHandler).to.be.calledWithExactly(trackerA);
    });

    it('should setup the `augmenters`', () => {
      const trackerA = new TrackerA();

      expect(trackerA.augmenters).to.be.a('object');
      expect(Object.values(trackerA.augmenters).every(a => typeof a === 'function')).to.be.true;
    });

    it('should bind: doLog()', () => {
      const trackerA = new TrackerA();

      expect(bind).to.be.calledWithExactly(trackerA);
      expect(trackerA.doLog).to.eq(cb);
    });
  });

  describe('Instance methods', () => {
    let trackerA;

    beforeEach(() => {
      trackerA = new TrackerA();
    });

    describe('init()', () => {
      let on;
      let bind;

      beforeEach(() => {
        on = sinon.spy();
        bind = sinon.stub();
        trackerA.service = { on };
        trackerA.handlers = { a: {} };
      });

      it('should subscribe to Events.EVENT_A, registering `handleEventA`', () => {
        const cb = () => null;
        bind.returns(cb);
        trackerA.handlers.a.handleEventA = { bind };
        trackerA.handlers.a.handleEventAA = { bind: () => null };

        trackerA.init();

        expect(on).to.be.calledWithExactly('event_a', cb);;
        expect(bind).to.be.calledWithExactly(trackerA.handlers.a);
      });

      it('should subscribe to Events.EVENT_AA, registering `handleEventAA`', () => {
        const cb = () => null;
        bind.returns(cb);
        trackerA.handlers.a.handleEventAA = { bind };
        trackerA.handlers.a.handleEventA = { bind: () => null };

        trackerA.init();

        expect(on).to.be.calledWithExactly('event_aa', cb);;
        expect(bind).to.be.calledWithExactly(trackerA.handlers.a);
      });
    });

    describe('doSetup()', () => {
      it('should return an object containing the setup data', () => {
        expect(trackerA.doSetup()).to.eql({ foo: 'bar' });
      });

      it('should spread the `data` and return the result', () => {
        const data = { baz: 'quux' };
        expect(trackerA.doSetup(data)).to.eql({ foo: 'bar', ...data });
      });

      it('should override default properties using the `data`', () => {
        const data = { foo: 'quux' };
        expect(trackerA.doSetup(data)).to.eql({ foo: 'quux' });
      });
    });

    describe('doAugment()', () => {
      it('should return a function, which returns a function', () => {
        const a = trackerA.doAugment();
        const b = a();

        expect(a).to.be.a('function');
        expect(b).to.be.a('function');
      });

      it('should return a `payload` object', () => {
        const payload = { foo: 'bar' };
        const a = trackerA.doAugment();
        const b = a();

        const result = b(payload);

        expect(result).to.eql(payload);
      });

      it('should invoke the augmenter functions with the `data` provided', () => {
        const data = { baz: 'quux' };
        const payload = { foo: 'bar' };
        const augmenter = sinon.spy(() => ({}));
        const a = trackerA.doAugment(data);
        const b = a([augmenter]);

        const result = b(payload);

        expect(augmenter).to.be.calledWithExactly(data);
      });

      it('should reduce and spread the augmenter function return values into the `payload`', () => {
        const payload = { foo: 'bar' };
        const valA = { bar: 'baz' };
        const valB = { baz: 'quux' };
        const augmenterA = () => valA;
        const augmenterB = () => valB;
        const a = trackerA.doAugment();
        const b = a([augmenterA, augmenterB]);

        const result = b(payload);

        expect(result).to.eql({ ...payload, ...valA, ...valB });
      });
    });

    describe('doLink()', () => {
      it('should return the payload', () => {
        const payload = { foo: 'bar' };
        expect(trackerA.doLink(payload)).to.eq(payload);
      });
    });

    describe('doLog()', () => {
      it('should add the payload to the `log`', () => {
        const payload = { foo: 'bar' };

        trackerA.doLog(payload);

        expect(trackerA.log).to.eql([payload]);
      });

      it('should not replace the existing `log` entries', () => {
        const payload = { foo: 'bar' };
        const log = ['a', 'b'];
        trackerA.log = log;

        trackerA.doLog(payload);

        expect(trackerA.log).to.eql([payload, ...log]);
      });

      it('should trim the log to the default max length', () => {
        const payload = { foo: 'bar' };
        const log = new Array(10).fill(null).map((_, i) => i);
        trackerA.log = log;

        trackerA.doLog(payload);

        expect(trackerA.log.length).to.eq(10);
        expect(trackerA.log).to.eql([payload, ...log.slice(0, 9)]);
      });

      it('should trim the log to the value specified via `opts`', () => {
        const payload = { foo: 'bar' };
        const maxLogLength = 3;
        const log = new Array(maxLogLength).fill(null).map((_, i) => i);
        trackerA.log = log;
        trackerA.opts = { maxLogLength };

        trackerA.doLog(payload);

        expect(trackerA.log.length).to.eq(maxLogLength);
        expect(trackerA.log).to.eql([payload, ...log.slice(0, maxLogLength - 1)]);
      });
    });

    describe('addBar()', () => {
      it('should return an object of the form: `{ bar: "baz" }`', () => {
        expect(trackerA.addBar()).to.eql({ bar: 'baz' });
      });
    });

    describe('addBaz()', () => {
      it('should return an object of the form: `{ baz: "quux" }`', () => {
        expect(trackerA.addBaz()).to.eql({ baz: 'quux' });
      });
    });

    describe('addQuux()', () => {
      it('should return an object of the form: `{ quux: "foo" }`', () => {
        expect(trackerA.addQuux()).to.eql({ quux: 'foo' });

      });
    });
  });

  describe('Instance properties', () => {
  });
});

