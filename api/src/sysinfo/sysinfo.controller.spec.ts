import { Test, type TestingModule } from '@nestjs/testing';

import { SysinfoController } from './sysinfo.controller';

describe('SysinfoController', () => {
  let controller: SysinfoController;

  beforeAll(async() => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SysinfoController],
    }).compile();

    controller = module.get(SysinfoController);
  });

  describe('sysinfo', () => {
    it('should return "ok"', () => {
      expect(controller.getSysinfo()).toBe('ok');
    });
  });
});
