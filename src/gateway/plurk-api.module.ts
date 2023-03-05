
import { Module } from '@nestjs/common';
import { PlurkApiService } from './plurk-api.service';
import { PlurksSerializer } from './plurks.serializer';

@Module({
  exports: [PlurkApiService],
  providers: [PlurkApiService, PlurksSerializer],
})
export class PlurkApiModule {}
