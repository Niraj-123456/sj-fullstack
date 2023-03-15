import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsString, IsNotEmpty, IsOptional } from 'class-validator';

//for swagger
export class HealthCheckResponseDTO {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  status: string;

  @ApiProperty()
  api_version: string;

  @ApiProperty()
  sub_api_version: string;

  @ApiProperty()
  message: string;
}
