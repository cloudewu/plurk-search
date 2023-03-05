import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthRequestDto } from '../dto/authRequest.dto';
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
  async postAuthenticate(@Body() body: AuthRequestDto): Promise<string> {
    return await this.authService.authenticate(body);
  }
}
