import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export interface AuthedUser {
  id : string
  email: string
} 

const getCurrentUserByContext = (context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest();
  return request.user;
};

export const CurrentUser = createParamDecorator<unknown, ExecutionContext, AuthedUser>(
  (_data: unknown, context: ExecutionContext) =>
    getCurrentUserByContext(context),
);
