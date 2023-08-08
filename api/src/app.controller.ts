import { Controller, Get, Redirect } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  @Redirect('/search', 301)
  getIndex() {} // eslint-disable-line @typescript-eslint/no-empty-function
}
