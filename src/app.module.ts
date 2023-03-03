import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { SearchModule } from './search/search.module';
import { SysinfoModule } from './sysinfo/sysinfo.module';

@Module({
  imports: [SearchModule, SysinfoModule],
  controllers: [AppController],
})
export class AppModule {}
