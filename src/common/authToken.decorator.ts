import { createParamDecorator, type ExecutionContext } from '@nestjs/common';

export const AuthToken = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const headers = ctx.switchToHttp().getRequest().headers;
    const token = headers.authorization;
    return token.replace('Bearer ', '');
  },
);
