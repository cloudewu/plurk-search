import { expectedSerializedResult, mockApiResponse } from './constants';
import { PlurksSerializer } from './plurks.serializer';

describe('PlurksSerializer', () => {
  let plurkSerializer: PlurksSerializer;

  beforeAll(async() => {
    plurkSerializer = new PlurksSerializer();
  });

  describe('serialize', () => {
    it('should correct map api resopnse to PlurksDto', () => {
      // given
      const apiResonse = mockApiResponse;
      // when
      const result = plurkSerializer.serialize(apiResonse);
      // then
      const expectedResponse = expectedSerializedResult;
      expect(result).toStrictEqual(expectedResponse);
    });
  });
});
