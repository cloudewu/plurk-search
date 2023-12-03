import { Body, Controller, Get, HttpCode, HttpStatus, Logger, Post } from '@nestjs/common';
import type { AuthResultsDto } from '@plurk-search/common/dto/AuthResults';
import { AuthToken } from '~api/common/authToken.decorator';
import { maskSecrets } from '~api/common/maskSecretsHelper';
import { AuthService } from './auth.service'; // eslint-disable-line @typescript-eslint/consistent-type-imports -- Nestjs dependency injection

@Controller('/auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Get()
  async getAuthenticationPage(): Promise<AuthResultsDto> {
    this.logRequest('/auth', {});
    return await this.authService.getAuthenticationLink();
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  async postAuthenticate(
    @AuthToken() token: string,
      @Body('code') code: string): Promise<string> {
    this.logRequest('/auth', { token, code });
    return await this.authService.authenticate(token, code);
  }

  private logRequest(endpoint: string, params: any) {
    const guardedParams = maskSecrets(params);
    this.logger.log(`Received Request: ${endpoint}; params: ${JSON.stringify(guardedParams)}`);
  }
}
