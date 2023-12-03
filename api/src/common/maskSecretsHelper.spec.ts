import maskSecrets from '~api/common/maskSecretsHelper';
import { mockApiResponse } from '~api/gateway/constants';

function expectMasked(inputStr: string): void {
  expect(inputStr).toMatch(/\*+/);
  expect(inputStr.length).toBeLessThanOrEqual(5);
}

describe('Helper - maskSecretsHelper', () => {
  it('should mask sensitive fields in plurk response', () => {
    // when
    const result = maskSecrets(mockApiResponse);

    // then
    result.plurks.forEach(plurk => {
      expectMasked(plurk.content);
      expectMasked(plurk.content_raw);
    });
    Object.values(result.plurk_users).forEach(user => {
      expectMasked(user.nick_name);
      expectMasked(user.display_name);
    });
  });

  it('should mask auth-related fields', () => {
    // when
    const result = maskSecrets({
      token: 'this is the token',
      secret: 123456,
    });

    // then
    expectMasked(result.token);
    expectMasked(result.secret.toString());
  });
});
