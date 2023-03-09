import { Test, type TestingModule } from '@nestjs/testing';
import { SysinfoController } from './sysinfo.controller';

describe('SysinfoController', () => {
  let module: TestingModule;

  beforeAll(async() => {
    module = await Test.createTestingModule({
      controllers: [SysinfoController],
    }).compile();
  });

  describe('sysinfo', () => {
    it('should return "ok"', () => {
      const controller = module.get(SysinfoController);
      expect(controller.getSysinfo()).toBe('ok');
    });
  });
});
