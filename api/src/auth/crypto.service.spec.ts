import { ConfigService } from '@nestjs/config';
import { CryptoService } from './crypto.service';

describe('CryptoService', () => {
  const fakeKeySeed = 'FAKE_CIPHER_KEY';
  const fakeKey = 'dmWHZ3Pm5g1D9blUhNenNJkqhV2nmoco';
  const plainText = 'This is the message.';

  let configService: ConfigService;
  let cryptoService: CryptoService;

  beforeAll(() => {
    configService = new ConfigService();
    jest.spyOn(configService, 'getOrThrow').mockImplementation((...args) => fakeKeySeed);

    cryptoService = new CryptoService(configService);
  });

  describe('constructor', () => {
    it('should generate key', () => {
      expect(cryptoService.checkKey(fakeKey)).toBeTruthy();
    });
  });

  describe('encrypt & decrypt', () => {
    it('should be able to decrypt encrypted data', () => {
      const encryptedText = cryptoService.encrypt(plainText);
      const decryptedText = cryptoService.decrypt(encryptedText);
      expect(decryptedText).toBe(plainText);
    });
  });
});
