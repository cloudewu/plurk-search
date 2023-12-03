import { createMock, type DeepMocked } from '@golevelup/ts-jest';
import { UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test, type TestingModule } from '@nestjs/testing';
import { AuthResultsDto } from '@plurk-search/common/dto/AuthResults';
import { AuthObject } from '~api/dataobject/AuthObject';
import { PlurkApiService } from '~api/gateway/plurk-api.service';
import { AuthService } from './auth.service';
import { CryptoService } from './crypto.service';

describe('AuthService', () => {
  let authService: AuthService;
  let cryptoService: CryptoService;
  let jwtService: JwtService;
  let plurkApiService: DeepMocked<PlurkApiService>;

  beforeAll(async() => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule.register({ secret: 'test-secret' })],
      providers: [AuthService, CryptoService],
    }).useMocker(token => {
      if (token === ConfigService) {
        // should explicitly mock the return value for CryptoService construction
        const configService = createMock<ConfigService>();
        configService.getOrThrow.mockReturnValue('env variable');
        return configService;
      }
      return createMock(token);
    }).compile();

    authService = module.get(AuthService);
    cryptoService = module.get(CryptoService);
    jwtService = module.get(JwtService);
    plurkApiService = module.get(PlurkApiService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAuthenticationLink', () => {
    it('should return auth page and encrypted token', async() => {
      // given
      const token = 'this is a token';
      const secret = 'this is the secret';
      const authPage = 'https://auth.page';
      plurkApiService.getRequestToken.mockResolvedValueOnce({ token, secret, authPage });
      jest.spyOn(authService, 'signAndEncrypt');
      // when
      const response = await authService.getAuthenticationLink();
      // then
      expect(response).toBeInstanceOf(AuthResultsDto);
      expect(response.authLink).toBe(authPage);
      expect(authService.signAndEncrypt).toBeCalledWith(token, secret);
    });
  });

  describe('authenticate', () => {
    const callWithArgs = (token: any, code: any) => async() => await authService.authenticate(token, code);

    it('should request authentication with given properties', async() => {
      // given
      const requestToken = 'This is a request token';
      const requestSecret = 'This is the request secret';
      const auth = new AuthObject({ token: requestToken, secret: requestSecret });
      const accessToken = 'This is a access token';
      const accessSecret = 'This is the access secret';
      const encryptedToken = 'This is a signed and encrypted token';
      const code = '1234';

      jest.spyOn(authService, 'decryptAndVerify').mockImplementationOnce((...args) => auth);
      plurkApiService.authenticate.mockResolvedValueOnce({ token: accessToken, secret: accessSecret });
      jest.spyOn(authService, 'signAndEncrypt').mockImplementationOnce((...args) => encryptedToken);
      // when
      const response = await authService.authenticate(requestToken, code);
      // then
      expect(plurkApiService.authenticate).toHaveBeenCalledWith(auth, code);
      expect(response).toBe(encryptedToken);
    });

    it('should reject invalid token', async() => {
      const code = 1234;
      await expect(callWithArgs(null, code)).rejects.toThrow(UnauthorizedException);
      await expect(callWithArgs(undefined, code)).rejects.toThrow(UnauthorizedException);
      await expect(callWithArgs('invalid token', code)).rejects.toThrow(UnprocessableEntityException);
      jest.spyOn(cryptoService, 'decrypt').mockImplementationOnce((...args) => 'decrypted token');
      await expect(callWithArgs('invalid token', code)).rejects.toThrow(UnauthorizedException);
    });

    it('should reject empty code', async() => {
      const token = 'This is a token';
      jest.spyOn(authService, 'decryptAndVerify').mockImplementationOnce((...args) => new AuthObject());
      await expect(callWithArgs(token, undefined)).rejects.toThrow(UnauthorizedException);

      jest.spyOn(authService, 'decryptAndVerify').mockImplementationOnce((...args) => new AuthObject());
      await expect(callWithArgs(token, null)).rejects.toThrow(UnauthorizedException);
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
      expect(response).toBeInstanceOf(AuthObject);
      expect(response.token).toBe(token);
      expect(response.secret).toBe(secret);
    });

    it('should reject invalid tokens', () => {
      expect(callWithArgs(undefined)).toThrow(UnauthorizedException);
      expect(callWithArgs(null)).toThrow(UnauthorizedException);
    });
  });
});
