import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const error =
      status !== HttpStatus.INTERNAL_SERVER_ERROR
        ? exception.message
        : 'Internal Server Error';

    response.status(status).json({
      success: false,
      statusCode: status,
      message: error,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
