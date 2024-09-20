import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

@Injectable()
export class CircleGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const circleId = request.headers['circleid']; // circleId'yi headers'dan alıyoruz

    if (!circleId) {
      throw new ForbiddenException('CircleID is required for this endpoint.');
    }

    return true; // circleId varsa, devam et
  }
}