import { Test, type TestingModule } from '@nestjs/testing';
import { SysinfoController } from './sysinfo.controller';

describe('SysinfoController', () => {
  let app: TestingModule;

  beforeAll(async() => {
    app = await Test.createTestingModule({
      controllers: [SysinfoController],
    }).compile();
  });

  describe('sysinfo', () => {
    it('should return "ok"', () => {
      const controller = app.get(SysinfoController);
      expect(controller.getSysinfo()).toBe('ok');
    });
  });
});
