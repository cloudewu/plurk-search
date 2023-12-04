// Kudos: https://medium.com/@enrico.ferro/create-a-test-case-for-custom-parameter-decorator-in-nestjs-7-d97de5c4e6a0

import { ROUTE_ARGS_METADATA } from '@nestjs/common/constants';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import * as httpMock from 'node-mocks-http';
import { AuthToken } from './authToken.decorator';

describe('AuthToken', () => {
  function getParamDecoratorFactory(decorator: any) {
    class TestDecorator {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      public test(@AuthToken() token: string) {}
    }

    const args = Reflect.getMetadata(ROUTE_ARGS_METADATA, TestDecorator, 'test');
    return args[Object.keys(args)[0]].factory;
  }

  describe('decorate', () => {
    it('should extract token from request header and prune "Bearer"', () => {
      // given
      const authorizationToken = 'ThisIsAAuthorizationToken';
      const req = httpMock.createRequest();
      const res = httpMock.createResponse();
      req.headers.authorization = `Bearer ${authorizationToken}`;
      const ctx = new ExecutionContextHost([req, res]);
      // when
      const factory = getParamDecoratorFactory(AuthToken);
      const token = factory(null, ctx);
      // then
      expect(token).toBeDefined();
      expect(token).toBe(authorizationToken);
    });

    it('should return null without Authorization header', () => {
      // given
      const req = httpMock.createRequest();
      const res = httpMock.createResponse();
      const ctx = new ExecutionContextHost([req, res]);
      // when
      const factory = getParamDecoratorFactory(AuthToken);
      const token = factory(null, ctx);
      // then
      expect(token).not.toBeDefined();
    });
  });
});
