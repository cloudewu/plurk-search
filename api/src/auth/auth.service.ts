import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import type { JwtService } from '@nestjs/jwt';
import { AuthResults } from '@plurk-search/common/dto/AuthResults';
import { isNullish } from '~api/common/util';
import { AuthObject } from '~api/dataobject/AuthObject';
import type { PlurkApiService } from '~api/gateway/plurk-api.service';

import type { CryptoService } from './crypto.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly cryptoService: CryptoService,
    private readonly jwtService: JwtService,
    private readonly plurkApiService: PlurkApiService,
  ) {}

  async getAuthenticationLink(): Promise<AuthResults> {
    const { token, secret, authPage } = await this.plurkApiService.getRequestToken();
    const response = new AuthResults({
      authLink: authPage,
      token: this.signAndEncrypt(token, secret),
    });
    return response;
  }

  async authenticate(requestToken: string, code: string): Promise<string> {
    const auth: AuthObject = this.decryptAndVerify(requestToken);
    if (isNullish(code)) {
      AuthService.raiseUnauthorized('Invalid Verifier');
    }

    const { token, secret } = await this.plurkApiService.authenticate(auth, code);
    return this.signAndEncrypt(token, secret);
  }

  signAndEncrypt(token: string, secret: string): string {
    const signedMessage = this.jwtService.sign({ token, secret });
    return this.cryptoService.encrypt(signedMessage);
  }

  decryptAndVerify(token: string): AuthObject {
    if (isNullish(token)) {
      AuthService.raiseUnauthorized('Invalid Token');
    }

    const decryptedToken = this.cryptoService.decrypt(token);
    this.verifyToken(decryptedToken);
    const decodedPayload: any = this.jwtService.decode(decryptedToken);
    return new AuthObject({ ...decodedPayload });
  }

  private verifyToken(token: string) {
    try {
      this.logger.log(`verifying token: ${token}`);
      this.jwtService.verify(token);
    } catch (err: any) {
      this.logger.error('token verification failed', err.stack, err.message);
      AuthService.raiseUnauthorized('Invalid Token');
    }
  }

  static raiseUnauthorized(message: string | undefined = undefined) {
    throw new UnauthorizedException(message);
  }
}
