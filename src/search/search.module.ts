
import { Module } from '@nestjs/common';
import { PlurkApiModule } from 'src/broker/plurk-api.module';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';

@Module({
  imports: [PlurkApiModule],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
