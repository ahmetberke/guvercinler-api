import { ExecutionContext, createParamDecorator } from '@nestjs/common';

const getCurrentCurrentCircleIDByContext = (context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest();
  return request.headers['circleid'];  // Header isimleri case-insensitive'dir, bu yüzden 'circleid' küçük harf ile yazıldı
};

export const CurrentCircleID = createParamDecorator<unknown, ExecutionContext, string>(
  (_data: unknown, context: ExecutionContext) =>
    getCurrentCurrentCircleIDByContext(context),
);
