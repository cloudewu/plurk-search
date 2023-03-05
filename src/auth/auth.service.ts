import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { isNullish } from '../common/util';
import { AuthDetail } from '../dto/authDetail.dto';
import type { AuthRequestDto } from '../dto/authRequest.dto';
import { AuthResponseDto } from '../dto/authResponse.dto';
import { PlurkApiService } from '../gateway/plurk-api.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly plurkApiService: PlurkApiService,
  ) {}

  async getAuthenticationLink(): Promise<AuthResponseDto> {
    const { token, secret, authPage } = await this.plurkApiService.getRequestToken();
    const response = new AuthResponseDto({
      authLink: authPage,
      token: this.jwtService.sign({ token, secret }),
    });
    return response;
  }

  async authenticate(request: AuthRequestDto): Promise<string> {
    const auth: AuthDetail = this.verifyAndDecodeCredentials(request.token);
    if (isNullish(request.code)) {
      AuthService.raiseBadRequest('Invalid Verifier');
    }

    const { token, secret } = await this.plurkApiService.authenticate(auth, request.code);
    return this.jwtService.sign({ token, secret });
  }

  verifyAndDecodeCredentials(token: string): AuthDetail {
    if (isNullish(token)) {
      AuthService.raiseBadRequest('Invalid Token');
    }

    this.verifyToken(token);
    const decodedPayload: any = this.jwtService.decode(token);
    return new AuthDetail({ ...decodedPayload });
  }

  private verifyToken(token: string) {
    try {
      this.logger.log(`verifying token: ${token}`);
      this.jwtService.verify(token);
    } catch (err: any) {
      this.logger.error('token verification failed');
      AuthService.raiseBadRequest('Invalid Token');
    }
  }

  static raiseBadRequest(message: string | undefined = undefined) {
    throw new BadRequestException(message);
  }
}
