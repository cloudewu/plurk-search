import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { isNullish } from '../common/util';
import { AuthDetail } from '../dto/authDetail.dto';
import { AuthResponseDto } from '../dto/authResponse.dto';
import { PlurkApiService } from '../gateway/plurk-api.service';
import { CryptoService } from './crypto.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly cryptoService: CryptoService,
    private readonly jwtService: JwtService,
    private readonly plurkApiService: PlurkApiService,
  ) {}

  async getAuthenticationLink(): Promise<AuthResponseDto> {
    const { token, secret, authPage } = await this.plurkApiService.getRequestToken();
    const response = new AuthResponseDto({
      authLink: authPage,
      token: this.signAndEncrypt(token, secret),
    });
    return response;
  }

  async authenticate(requestToken: string, code: string): Promise<string> {
    const auth: AuthDetail = this.decryptAndVerify(requestToken);
    if (isNullish(code)) {
      AuthService.raiseBadRequest('Invalid Verifier');
    }

    const { token, secret } = await this.plurkApiService.authenticate(auth, code);
    return this.signAndEncrypt(token, secret);
  }

  signAndEncrypt(token: string, secret: string): string {
    const signedMessage = this.jwtService.sign({ token, secret });
    return this.cryptoService.encrypt(signedMessage);
  }

  decryptAndVerify(token: string): AuthDetail {
    if (isNullish(token)) {
      AuthService.raiseBadRequest('Invalid Token');
    }

    const decryptedToken = this.cryptoService.decrypt(token);
    this.verifyToken(decryptedToken);
    const decodedPayload: any = this.jwtService.decode(decryptedToken);
    return new AuthDetail({ ...decodedPayload });
  }

  private verifyToken(token: string) {
    try {
      this.logger.log(`verifying token: ${token}`);
      this.jwtService.verify(token);
    } catch (err: any) {
      this.logger.error('token verification failed', err.stack, err.message);
      AuthService.raiseBadRequest('Invalid Token');
    }
  }

  static raiseBadRequest(message: string | undefined = undefined) {
    throw new BadRequestException(message);
  }
}
