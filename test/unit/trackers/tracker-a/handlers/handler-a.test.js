const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const { HandlerA } = require('../../../../../src/trackers/tracker-a/handlers');
const { Utils } = require('../../../../../src/utils');

const { expect } = chai;

chai.use(sinonChai);

describe('HandlerA', () => {
  describe('General', () => {
    it('should be importable', () => {
      expect(HandlerA).to.be.a('function');
    });

    it('should be constructable', () => {
      expect(new HandlerA).to.be.an.instanceof(HandlerA);
    });
  });

  describe('Instance methods', () => {
    const noop = () => null;
    let a;
    let b;
    let handlerA;
    let doSetup;
    let doAugment;
    let doLink;
    let doLog;

    beforeEach(() => {
      a = () => null;
      b = sinon.spy(() => a);
      doSetup = sinon.spy();
      doAugment = sinon.spy(() => b);
      doLink = sinon.spy();
      doLog = sinon.spy();
      handlerA = new HandlerA({
        doSetup,
        doAugment,
        doLink,
        doLog,
        augmenters: {
          computeBar: noop,
          computeBaz: noop,
          computeQuux: noop,
        },
      });
    });

    describe('handleEventA()', () => {
      it('should return the result of `Utils.pipe()`', () => {
        pipe = sinon.stub(Utils, 'pipe').returns('foo');

        const result = handlerA.handleEventA();

        expect(result).to.eq('foo');

        pipe.restore();
      });

      it('should invoke `Utils.pipe()` with `{ event: "myEvent" }`', () => {
        pipe = sinon.stub(Utils, 'pipe');

        handlerA.handleEventA();

        expect(pipe).to.be.calledWith({ event: 'myEvent' });

        pipe.restore();
      });

      it('should invoke `doSetup()`, `doAugment()`, `doLink()`, and `doLog()`', () => {
        handlerA.handleEventA();

        expect(doSetup).to.be.called;
        expect(doAugment).to.be.called;
        expect(doLink).to.be.called;
        expect(doLog).to.be.called;
      });

      it('should invoke `doAugment()` with the data', () => {
        const data = { foo: 'bar' };

        handlerA.handleEventA(data);

        expect(doAugment).to.be.calledWithExactly(data);
      });

      it('should invoke the function returned by `doAugment` with the correct augmenters', () => {
        const {
          computeBar,
          computeBaz,
        } = handlerA.tracker.augmenters;
        handlerA.handleEventA();

        expect(b).to.be.calledWithExactly([computeBar, computeBaz]);
      });
    });

    describe('handleEventAA()', () => {
      it('should return the result of `Utils.pipe()`', () => {
        pipe = sinon.stub(Utils, 'pipe').returns('foo');

        const result = handlerA.handleEventAA();

        expect(result).to.eq('foo');

        pipe.restore();
      });

      it('should invoke `Utils.pipe()` with `{ event: "myEvent" }`', () => {
        pipe = sinon.stub(Utils, 'pipe');

        handlerA.handleEventAA();

        expect(pipe).to.be.calledWith({ event: 'myAAEvent' });

        pipe.restore();
      });

      it('should invoke `doSetup()`, `doAugment()`, `doLink()`, and `doLog()`', () => {
        handlerA.handleEventAA();

        expect(doSetup).to.be.called;
        expect(doAugment).to.be.called;
        expect(doLink).to.be.called;
        expect(doLog).to.be.called;
      });

      it('should invoke `doAugment()` with the data', () => {
        const data = { foo: 'bar' };

        handlerA.handleEventAA(data);

        expect(doAugment).to.be.calledWithExactly(data);
      });

      it('should invoke the function returned by `doAugment` with the correct augmenters', () => {
        const {
          computeQuux,
        } = handlerA.tracker.augmenters;
        handlerA.handleEventAA();

        expect(b).to.be.calledWithExactly([computeQuux]);
      });
    });
  });
});
