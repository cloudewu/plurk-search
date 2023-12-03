import { Body, Controller, Get, HttpCode, HttpStatus, Logger, Post } from '@nestjs/common';
import type { AuthResponse } from '@plurk-search/common/dto/AuthResponse';
import { AuthToken } from '~api/common/authToken.decorator';

import type { AuthService } from './auth.service';

@Controller('/auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Get()
  async getAuthenticationPage(): Promise<AuthResponse> {
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
    this.logger.log(`Received Request: ${endpoint}; params: ${JSON.stringify(params)}`);
  }
}
