import BaseDto from './Base';

describe('BaseDto', () => {
  it('passes given arguments to the instance', () => {
    const parameters: Record<string, unknown> = {
      string: 'val1',
      emptyString: '',
      num: 1,
      zero: 0,
      obj: {
        key: 'val',
      },
      emptyObj: {},
      arr: ['string', '', 1, 0, { key: 'val' }, {}],
      emptyArr: [],
    };
    const instance = new BaseDto(parameters);

    Object.entries(parameters).forEach(([key, val]) => {
      expect(instance[key as keyof typeof instance]).toEqual(val);
    });
  });

  it('accepts undefined arguments', () => {
    expect(() => new BaseDto()).not.toThrow();
  });
});
