import { ApiProperty } from '@nestjs/swagger';

class ClientWebAppHomePageRowDTO {
  @ApiProperty({
    description:
      'each row should atleast contain isShown boolean that determines whether the row will be shown or not',
  })
  isShown: boolean;

  heading?: string;

  serviceList?: any;
}

export class ClientWebAppHomePageDataResponseDTO {
  @ApiProperty({ type: ClientWebAppHomePageRowDTO })
  navBarRow: ClientWebAppHomePageRowDTO;

  @ApiProperty({ type: ClientWebAppHomePageRowDTO })
  mainRow: ClientWebAppHomePageRowDTO;

  @ApiProperty({ type: ClientWebAppHomePageRowDTO })
  benefitsRow: ClientWebAppHomePageRowDTO;

  @ApiProperty({ type: ClientWebAppHomePageRowDTO })
  registrationPromotionRow: ClientWebAppHomePageRowDTO;

  @ApiProperty({ type: ClientWebAppHomePageRowDTO })
  detailedBookingRow: ClientWebAppHomePageRowDTO;

  @ApiProperty({ type: ClientWebAppHomePageRowDTO })
  clientTestimonialsRow: ClientWebAppHomePageRowDTO;

  @ApiProperty({ type: ClientWebAppHomePageRowDTO })
  footer: ClientWebAppHomePageRowDTO;
}
