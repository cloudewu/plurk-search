import { createMock } from '@golevelup/ts-jest';
import { Test, type TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';

describe('AppController', () => {
  let controller: AppController;

  beforeAll(async() => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
    }).useMocker(createMock)
      .compile();

    controller = module.get(AppController);
  });

  describe('getIndex', () => {
    it('should not fail', () => {
      expect(() => { controller.getIndex(); }).not.toThrow();
    });
  });
});
