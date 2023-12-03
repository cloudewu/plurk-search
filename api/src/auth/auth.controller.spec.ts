import { createMock, type DeepMocked } from '@golevelup/ts-jest';
import { Test, type TestingModule } from '@nestjs/testing';
import { AuthResultsDto } from '@plurk-search/common/dto/AuthResults';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let service: DeepMocked<AuthService>;

  beforeAll(async() => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
    }).useMocker(createMock)
      .compile();

    controller = module.get(AuthController);
    service = module.get(AuthService);
    service.getAuthenticationLink.mockResolvedValue(new AuthResultsDto());
    service.authenticate.mockResolvedValue('access token');
  });

  describe('getAuthenticationPage', () => {
    it('should return the info for authentication', async() => {
      const ret = await controller.getAuthenticationPage();
      expect(ret).toBeInstanceOf(AuthResultsDto);
    });
  });

  describe('postAuthenticate', () => {
    it('should acknowlodge the authentication request', async() => {
      // given
      const token = 'This is a token';
      const code = '1234';
      // when
      await controller.postAuthenticate(token, code);
      // then
      expect(service.authenticate).toBeCalledWith(token, code);
    });
  });
});
