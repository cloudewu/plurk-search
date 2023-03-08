import { BadRequestException, UnprocessableEntityException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test, type TestingModule } from '@nestjs/testing';
import { AuthDetail } from '../dto/authDetail.dto';
import { AuthResponseDto } from '../dto/authResponse.dto';
import { PlurkApiService } from '../gateway/plurk-api.service';
import { AuthService } from './auth.service';
import { CryptoService } from './crypto.service';

describe('AuthService', () => {
  let app: TestingModule;
  let authService: AuthService;
  let cryptoService: CryptoService;
  let jwtService: JwtService;

  const mockPlurkApiService = {
    getRequestToken: jest.fn(),
    authenticate: jest.fn(),
  };

  beforeAll(async() => {
    app = await Test.createTestingModule({
      imports: [JwtModule.register({ secret: 'test-secret' })],
      providers: [AuthService, CryptoService],
    }).useMocker(token => {
      if (token === PlurkApiService) {
        return mockPlurkApiService;
      }
      if (token === ConfigService) {
        const configService = new ConfigService();
        jest.spyOn(configService, 'getOrThrow').mockImplementation((...args) => 'env variable');
        return configService;
      }
    }).compile();

    authService = app.get(AuthService);
    cryptoService = app.get(CryptoService);
    jwtService = app.get(JwtService);
  });

  describe('getAuthenticationLink', () => {
    it('should return auth page and encrypted token', async() => {
      // given
      const token = 'this is a token';
      const secret = 'this is the secret';
      const authPage = 'https://auth.page';
      mockPlurkApiService.getRequestToken.mockResolvedValue({
        token, secret, authPage,
      });
      jest.spyOn(authService, 'signAndEncrypt');
      // when
      const response = await authService.getAuthenticationLink();
      // then
      expect(response).toBeInstanceOf(AuthResponseDto);
      expect(response.authLink).toBe(authPage);
      expect(authService.signAndEncrypt).toBeCalledWith(token, secret);

      // cleanup
      jest.restoreAllMocks();
    });
  });

  describe('authenticate', () => {
    const callWithArgs = (token: any, code: any) => async() => await authService.authenticate(token, code);

    it('should request authentication with given properties', async() => {
      // given
      const requestToken = 'This is a request token';
      const requestSecret = 'This is the request secret';
      const auth = new AuthDetail({ token: requestToken, secret: requestSecret });
      const accessToken = 'This is a access token';
      const accessSecret = 'This is the access secret';
      const encryptedToken = 'This is a signed and encrypted token';
      const code = '1234';

      jest.spyOn(authService, 'decryptAndVerify').mockImplementationOnce((...args) => auth);
      mockPlurkApiService.authenticate.mockImplementationOnce((...args) => ({ token: accessToken, secret: accessSecret }));
      jest.spyOn(authService, 'signAndEncrypt').mockImplementationOnce((...args) => encryptedToken);
      // when
      const response = await authService.authenticate(requestToken, code);
      // then
      expect(mockPlurkApiService.authenticate).toHaveBeenCalledWith(auth, code);
      expect(response).toBe(encryptedToken);

      // cleanup
      jest.restoreAllMocks();
    });

    it('should reject invalid token', async() => {
      const code = 1234;
      await expect(callWithArgs(null, code)).rejects.toThrow(BadRequestException);
      await expect(callWithArgs(undefined, code)).rejects.toThrow(BadRequestException);
      await expect(callWithArgs('invalid token', code)).rejects.toThrow(UnprocessableEntityException);
      jest.spyOn(cryptoService, 'decrypt').mockImplementation((...args) => 'decrypted token');
      await expect(callWithArgs('invalid token', code)).rejects.toThrow(BadRequestException);

      // cleanup
      jest.restoreAllMocks();
    });

    it('should reject empty code', async() => {
      const token = 'This is a token';
      jest.spyOn(authService, 'decryptAndVerify').mockImplementation((...args) => new AuthDetail());
      await expect(callWithArgs(token, undefined)).rejects.toThrow(BadRequestException);
      await expect(callWithArgs(token, null)).rejects.toThrow(BadRequestException);

      // cleanup
      jest.restoreAllMocks();
    });
  });

  describe('signAndEncrypt', () => {
    it('should sign and encrypt credentials', () => {
      // given
      const token = 'This is a token';
      const secret = 'This is the secret';
      jest.spyOn(jwtService, 'sign');
      jest.spyOn(cryptoService, 'encrypt');
      // when
      const response = authService.signAndEncrypt(token, secret);
      // then
      expect(response).not.toBeNull();
      expect(jwtService.sign).toBeCalledTimes(1);
      expect(cryptoService.encrypt).toBeCalledTimes(1);

      // cleanup
      jest.restoreAllMocks();
    });
  });

  describe('decryptAndVerify', () => {
    const callWithArgs = (arg: any) => () => authService.decryptAndVerify(arg);

    it('should verify and decode a token', () => {
      // given
      const token = 'This is a token';
      const secret = 'This is the secret';
      const signedToken = jwtService.sign({ token, secret });
      const encryptedToken = cryptoService.encrypt(signedToken);
      // when
      const response = authService.decryptAndVerify(encryptedToken);
      // then
      expect(response).toBeInstanceOf(AuthDetail);
      expect(response.token).toBe(token);
      expect(response.secret).toBe(secret);
    });

    it('should reject invalid tokens', () => {
      expect(callWithArgs(undefined)).toThrow(BadRequestException);
      expect(callWithArgs(null)).toThrow(BadRequestException);
    });
  });
});
