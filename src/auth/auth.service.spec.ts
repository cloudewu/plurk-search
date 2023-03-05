import { BadRequestException } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test, type TestingModule } from '@nestjs/testing';
import { AuthDetail } from '../dto/authDetail.dto';
import { AuthResponseDto } from '../dto/authResponse.dto';
import { PlurkApiService } from '../gateway/plurk-api.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let app: TestingModule;
  let jwtService: JwtService;
  let authService: AuthService;

  const mockPlurkApiService = {
    getRequestToken: jest.fn(),
    authenticate: jest.fn(),
  };

  beforeAll(async() => {
    app = await Test.createTestingModule({
      imports: [JwtModule.register({ secret: 'test-secret' })],
      providers: [AuthService],
    }).useMocker(token => {
      if (token === PlurkApiService) {
        return mockPlurkApiService;
      }
    }).compile();

    authService = app.get(AuthService);
    jwtService = app.get(JwtService);
  });

  beforeEach(() => {
    jest.spyOn(jwtService, 'verify').mockImplementation((...args) => ({}));
  });

  describe('getAuthenticationLink', () => {
    it('should return auth page and signed token', async() => {
      // given
      const token = 'this is a token';
      const secret = 'this is the secret';
      const authPage = 'https://auth.page';
      mockPlurkApiService.getRequestToken.mockResolvedValue({
        token, secret, authPage,
      });
      // when
      const response = await authService.getAuthenticationLink();
      // then
      expect(response).toBeInstanceOf(AuthResponseDto);
      expect(response.authLink).toBe(authPage);
      const expectedToken = jwtService.sign({ token, secret });
      expect(response.token).toBe(expectedToken);
    });

    // cleanup
    jest.restoreAllMocks();
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
      const signedToken = 'This is a signed JWT token';
      const code = '1234';

      jest.spyOn(authService, 'verifyAndDecodeCredentials').mockImplementationOnce((...args) => auth);
      mockPlurkApiService.authenticate.mockImplementationOnce((...args) => ({ token: accessToken, secret: accessSecret }));
      jest.spyOn(authService, 'signCredentials').mockImplementationOnce((...args) => signedToken);
      // when
      const response = await authService.authenticate(requestToken, code);
      // then
      expect(mockPlurkApiService.authenticate).toHaveBeenCalledWith(auth, code);
      expect(response).toBe(signedToken);

      // cleanup
      jest.restoreAllMocks();
    });

    it('should reject invalid jwt token', async() => {
      const code = 1234;
      await expect(callWithArgs(null, code)).rejects.toThrow(BadRequestException);
    });

    it('should reject empty code', async() => {
      const token = 'This is a token';
      await expect(callWithArgs(token, undefined)).rejects.toThrow(BadRequestException);
      await expect(callWithArgs(token, null)).rejects.toThrow(BadRequestException);
    });
  });

  describe('signCredentials', () => {
    it('should sign credentials', () => {
      // given
      const token = 'This is a token';
      const secret = 'This is the secret';
      // when
      const response = authService.signCredentials(token, secret);
      // then
      const expectedToken = jwtService.sign({ token, secret });
      expect(response).toBe(expectedToken);
    });
  });

  describe('verifyAndDecodeCredentials', () => {
    const callWithArgs = (arg: any) => () => authService.verifyAndDecodeCredentials(arg);

    it('should verify and decode a token', () => {
      // given
      const token = 'This is a token';
      const secret = 'This is the secret';
      const jwtToken = jwtService.sign({ token, secret });
      // when
      const response = authService.verifyAndDecodeCredentials(jwtToken);
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
