const { expect } = require('chai');

const { TrackerService } = require('../../../src/service');

describe('TrackerService', () => {
  describe('General', () => {
    it('should be importable', () => {
      expect(TrackerService).to.be.a('function');
    });

    it('should be constructable', () => {
      expect(new TrackerService).to.be.an.instanceof(TrackerService);
    });
  });

  describe('Class methods', () => {
    describe('classMethod()', () => {
      // Make assertions about the class method under test.
    });
  });

  describe('Class properties', () => {
    describe('classProperty', () => {
      // Make assertions about the class property under test.
    });
  });

  describe('Instance methods', () => {
    describe('instanceMethod()', () => {
      // Make assertions about the instance method under test.
    });
  });

  describe('Instance properties', () => {
    describe('instanceProperty', () => {
      // Make assertions about the instance property under test.
    });
  });
});

