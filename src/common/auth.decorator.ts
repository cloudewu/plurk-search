import { createParamDecorator, type ExecutionContext } from '@nestjs/common';

export const Auth = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const headers = ctx.switchToHttp().getRequest().headers;
    return headers.authorization;
  },
);
