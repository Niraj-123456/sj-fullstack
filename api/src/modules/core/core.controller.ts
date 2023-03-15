import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { HealthCheckResponseDTO } from './core.dto';
import { CoreService } from './core.service';

@ApiTags('core')
@Controller('/api/core')
export class CoreController {
  constructor(private readonly coreService: CoreService) {}

  //   @UseGuards(HeaderApiKeyAuthGuard)
  //   @ApiSecurity("apiKey")
  @ApiOperation({
    summary: 'Displays that the server is running',
    description:
      'This api is used when there is a need to check whether the api is up or not',
  })
  @ApiOkResponse({ type: HealthCheckResponseDTO })
  @Get('health-check')
  getStatus(): object {
    console.log('Normal log for showing Health check was hit');
    return this.coreService.getStatus();
  }
}
