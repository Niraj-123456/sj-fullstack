import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpAdapterHost,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { SlackService } from 'modules/slack/slack.service';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly slackService: SlackService,
  ) {}

  async catch(exception: any, host: ArgumentsHost): Promise<void> {
    // In certain situations `httpAdapter` might not be available in the
    // constructor method, thus we should resolve it here.
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const responseBody = {
      statusCode: httpStatus,
      timestamp: new Date().toISOString(),
      path: this.httpAdapterHost.httpAdapter.getRequestUrl(ctx.getRequest()),
      success: false,
      message: exception.response?.message || exception.message,
    };

    // the logs should be sent to slack only for stage and prod, channel so
    if (process.env.MODE === 'stage' || process.env.MODE === 'prod') {
      //Initially we log it only for Internal server error
      if (responseBody.statusCode >= HttpStatus.INTERNAL_SERVER_ERROR) {
        await this.slackService.sendLogToSlack(
          responseBody.path,
          ctx.getRequest<Request>(),
          exception,
        );
        responseBody.message =
          'Internal server error.Please contact the administrator.';
      }
    }

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
