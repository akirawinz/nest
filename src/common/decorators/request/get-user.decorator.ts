import { UserDto } from '@modules/user/dto/user.dto';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface User extends UserDto {}
  }
}

/**
 * get User from request
 */
export const GetUser = createParamDecorator<unknown, unknown, UserDto>(
  (_, ctx: ExecutionContext): UserDto => {
    const req = ctx.switchToHttp().getRequest<Request>();
    return req.user;
  },
);
