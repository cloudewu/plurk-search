import * as util from './util';

describe('Util', () => {
  describe('isNullish', () => {
    it('should return true for null or undefined', () => {
      expect(util.isNullish(undefined)).toBeTruthy();
      expect(util.isNullish(null)).toBeTruthy();
      expect(util.isNullish('')).toBeFalsy();
      expect(util.isNullish(0)).toBeFalsy();
      expect(util.isNullish({})).toBeFalsy();
      expect(util.isNullish([])).toBeFalsy();
    });
  });
});
