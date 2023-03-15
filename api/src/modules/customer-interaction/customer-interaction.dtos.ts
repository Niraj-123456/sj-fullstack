import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';

// Instead of Create DTO directly using customerEntity
// export class CreateCustomerInteractionDTO {
//   @ApiProperty({
//     enum: CustomerInteractionTypeEnum,
//   })
//   @IsEnum(CustomerInteractionTypeEnum)
//   type: string;

//   @ApiPropertyOptional({
//     enum: CustomerInteractionStatusEnum,
//   })
//   @IsOptional()
//   @IsEnum(CustomerInteractionStatusEnum)
//   status: string;

//   @ApiProperty()
//   @IsOptional()
//   @IsString()
//   explanation: string;

//   @ApiPropertyOptional()
//   @IsOptional()
//   @IsUUID()
//   businessWhoseRequestId: string;

//   @ApiPropertyOptional()
//   @IsOptional()
//   @IsUUID()
//   userWhoseRequestId: string;

//   @ApiPropertyOptional()
//   @IsOptional()
//   @IsUUID()
//   representativeWhoseRequestId: string;
// }
