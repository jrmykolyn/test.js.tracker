const {
  Events,
  TrackerService,
  // A-related
  HandlerA,
  TrackerA,
} = require('../src');

const trackerService = new TrackerService({
  trackers: {
    a: {
      tracker: TrackerA,
      opts: {
        handlers: {
          a: HandlerA
        },
      },
    },
  },
});

trackerService.init();
trackerService.emit(Events.EVENT_A, { foo: 'bar' });
trackerService.emit(Events.EVENT_AA, { foo: 'bar' });
trackerService.emit(Events.EVENT_A, { foo: 'bar' });
trackerService.emit(Events.EVENT_A, { foo: 'bar' });
trackerService.emit(Events.EVENT_AA, { foo: 'bar' });
trackerService.emit(Events.EVENT_AA, { foo: 'bar' });
console.log(trackerService.trackers.a.log);
