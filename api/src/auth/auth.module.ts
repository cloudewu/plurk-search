import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PlurkApiModule } from '~api/gateway/plurk-api.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CryptoService } from './crypto.service';

@Module({
  imports: [
    PlurkApiModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async(configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_SECRET'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, CryptoService],
  exports: [AuthService],
})
export class AuthModule { }
