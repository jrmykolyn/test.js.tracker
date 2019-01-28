const { expect } = require('chai');

const { Utils } = require('../../../src/utils');

describe('Utils', () => {
  describe('pipe()', () => {
    it('should reduce an initial value through an array of functions and return the result', () => {
      const { pipe } = Utils;
      const inc = (n) => n + 1;
      const initialValue = 0;

      const result = pipe(initialValue, inc, inc, inc);

      expect(result).to.eq(3);
    });
  });
});
