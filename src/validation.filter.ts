import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Logger, LoggerService } from './logger';
import { ValidationException } from './validation.exception';

@Catch(ValidationException)
export class ValidationFilter implements ExceptionFilter {
  catch(exception: ValidationException, host: ArgumentsHost): any {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const loggerService: Logger = new LoggerService();

    const { message } = exception;

    loggerService.error({
      message,
    });

    response.status(422).json({
      status: 422,
      message: 'Validation Error',
      errors: exception.validationErrors,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
