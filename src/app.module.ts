import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { SearchModule } from './search/search.module';
import { SysinfoModule } from './sysinfo/sysinfo.module';

@Module({
  imports: [
    AuthModule, SearchModule, SysinfoModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
})
export class AppModule {}
