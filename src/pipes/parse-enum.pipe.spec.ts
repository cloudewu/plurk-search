import { BadRequestException } from '@nestjs/common';
import { ParseEnumPipe } from './parse-enum.pipe';

enum TestEnum {
  VAL1,
  VAL2,
  VAL3,
}

describe('ParseEnumPipe', () => {
  let parseEnumPipe: ParseEnumPipe;

  beforeAll(async() => {
    parseEnumPipe = new ParseEnumPipe(TestEnum);
  });

  describe('transform', () => {
    it('should collect enum values on init', () => {
      expect(parseEnumPipe.enumValues).toContainEqual('VAL1');
      expect(parseEnumPipe.enumValues).toContainEqual('VAL2');
      expect(parseEnumPipe.enumValues).toContainEqual('VAL3');
    });

    it('should transform a string to enum value', () => {
      expect(parseEnumPipe.transform('VAL1')).toBe(TestEnum.VAL1);
      expect(parseEnumPipe.transform('VAL2')).toBe(TestEnum.VAL2);
      expect(parseEnumPipe.transform('VAL3')).toBe(TestEnum.VAL3);
    });

    it('should raise 400 if invalid value is given', () => {
      const callTransform = (value: any) => () => parseEnumPipe.transform(value);

      expect(callTransform(null)).toThrow(BadRequestException);
      expect(callTransform(undefined)).toThrow(BadRequestException);
      expect(callTransform('INVALID')).toThrow(BadRequestException);
    });
  });
});
