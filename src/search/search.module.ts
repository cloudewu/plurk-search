import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from '../auth/auth.module';
import { PlurkApiModule } from '../gateway/plurk-api.module';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';

@Module({
  imports: [AuthModule, ConfigModule, PlurkApiModule],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
