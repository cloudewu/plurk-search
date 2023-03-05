import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthToken } from '../common/authToken.decorator';
import type { AuthResponseDto } from '../dto/authResponse.dto';
import { AuthService } from './auth.service';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  async getAuthenticationPage(): Promise<AuthResponseDto> {
    return await this.authService.getAuthenticationLink();
  }

  @Post()
  @HttpCode(HttpStatus.OK)
  async postAuthenticate(
    @AuthToken() token: string,
      @Body('code') code: string): Promise<string> {
    return await this.authService.authenticate(token, code);
  }
}
