import { Controller, UseGuards, Post, Body, Req, Query } from '@nestjs/common';
import { ApiBody, ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GenericResponseDTO } from 'common/dto/response.dto';
import { OptionalJwtButCompulsoryClientApiKeyToGetTheClientGuard } from '../auth/guards/jwt-auth.guard';
import { CreateVisitRequestDTO } from './visit.dtos';
import { Visit } from './visit.entity';
import { VisitService } from './visit.service';

@ApiTags('visit')
@Controller('visit')
export class VisitController {
  constructor(private readonly visitService: VisitService) {}

  @ApiOperation({
    summary: 'Registers the user visit',
    description:
      'When a user loads our webapp or mobapp, we register their visit via this API',
  })
  @ApiHeader({ name: 'sj-client-api-key' })
  @ApiBody({ type: CreateVisitRequestDTO })
  @UseGuards(OptionalJwtButCompulsoryClientApiKeyToGetTheClientGuard)
  @Post('register-visit')
  register(
    @Req() req,
    @Body() visitInfo: CreateVisitRequestDTO,
  ): Promise<GenericResponseDTO> {
    if (req.user?.filteredSourceType) {
      visitInfo.filteredSourceType = req.user?.filteredSourceType;
    }
    return this.visitService.addVisit(visitInfo);
  }
}
