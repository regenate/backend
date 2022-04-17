import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Logger } from './logger/interfaces';
import { LoggerService } from './logger/logger.service';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const loggerService: Logger = new LoggerService();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.BAD_REQUEST;

    const { message } = exception;

    loggerService.error({
      message,
    });

    response.status(status).json({
      status,
      message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
