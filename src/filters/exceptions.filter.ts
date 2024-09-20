import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { Request, Response } from "express";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  async catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: number;
    let message: string;
    
    console.log(exception);

    if (exception instanceof PrismaClientKnownRequestError) {
      if (exception.code === 'P2002') {
        const target = (exception.meta?.target as string).split("_")[1];
        message = target + " already exists"
        status = HttpStatus.CONFLICT; // 409 Conflict
      } else {
        status = HttpStatus.BAD_REQUEST;
        message = 'Prisma error occurred';
      }
    } else if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      
      if (typeof res === 'string') {
        message = res
      }else if (typeof res === 'object' && res !== null) {
        const resObj = res as any
        message = resObj.message || resObj.error || 'Bilinmeyen hata'
      }
      message = exception.getResponse() as string;
    }else {
      status = HttpStatus.INTERNAL_SERVER_ERROR
      message = 'Internal server error';
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      details: message
    })

  }
}