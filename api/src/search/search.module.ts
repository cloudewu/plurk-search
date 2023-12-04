import { Module } from '@nestjs/common';
import { AuthModule } from '~api/auth/auth.module';
import { PlurkApiModule } from '~api/gateway/plurk-api.module';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';

@Module({
  imports: [AuthModule, PlurkApiModule],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
