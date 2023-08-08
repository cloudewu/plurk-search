import { Controller, Get } from '@nestjs/common';

@Controller('sysinfo')
export class SysinfoController {
  @Get()
  getSysinfo(): string {
    return 'ok';
  }
}
